"""
逐灯烘焙全局光照。9 盏可烘焙的灯分三组，每组三盏打包进一张贴图的 R/G/B。
整屋共用一套 UV，所以三张贴图叠加起来就是全屋的完整光照。

    BAKE_SAMPLES=192 blender -b tools/_work/house.blend -P tools/bake_lightmap.py
"""
import bpy, sys, json, os
import numpy as np
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import plan

OUT = Path(__file__).resolve().parent / "_work"
SIZE = plan.LIGHTMAP_SIZE
SAMPLES = int(os.environ.get("BAKE_SAMPLES", "160"))


def setup_bake():
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    sc.cycles.device = "GPU"
    sc.cycles.samples = SAMPLES
    sc.cycles.use_denoising = True
    sc.cycles.bake_type = "DIFFUSE"
    b = sc.render.bake
    b.use_pass_direct = True
    b.use_pass_indirect = True
    b.use_pass_color = False       # 只要光照，不要 albedo
    b.use_selected_to_active = False
    b.margin = 10
    prefs = bpy.context.preferences.addons.get("cycles")
    if prefs:
        prefs.preferences.compute_device_type = "METAL"
        prefs.preferences.get_devices()
        for d in prefs.preferences.devices:
            d.use = d.type != "CPU"


def attach_target(obj, image):
    for slot in obj.material_slots:
        mat = slot.material
        if not mat or not mat.use_nodes:
            continue
        nodes = mat.node_tree.nodes
        node = nodes.get("BakeTarget") or nodes.new("ShaderNodeTexImage")
        node.name = "BakeTarget"
        node.image = image
        node.select = True
        nodes.active = node


def read_luminance(image):
    buf = np.empty(SIZE * SIZE * 4, dtype=np.float32)
    image.pixels.foreach_get(buf)
    px = buf.reshape(SIZE, SIZE, 4)
    # 白光烘的，三通道差异只来自表面反照率；取亮度作为「这盏灯照到这里有多亮」
    return px[:, :, 0] * 0.2126 + px[:, :, 1] * 0.7152 + px[:, :, 2] * 0.0722


def main():
    setup_bake()
    shell = bpy.data.objects["Shell"]
    shell.data.uv_layers.active = shell.data.uv_layers["Lightmap"]

    all_lamps = [bpy.data.objects[L["id"]] for L in plan.LAMPS]
    original = [(l.data.color[:], l.hide_render) for l in all_lamps]
    for l in all_lamps:
        l.data.color = (1.0, 1.0, 1.0)     # 颜色留到运行时

    # world 光对每次烘焙都有贡献，不掐掉的话每个通道都会带一份，
    # 叠加起来就是好几倍环境光。环境光和日光交给运行时实时算。
    world_bg = bpy.context.scene.world.node_tree.nodes["Background"]
    world_strength = world_bg.inputs[1].default_value
    world_bg.inputs[1].default_value = 0.0

    atlases = []
    for ai, group in enumerate(plan.ATLASES):
        rgba = np.ones((SIZE, SIZE, 4), dtype=np.float32)
        peak = {}
        lum_by_channel = {}

        for L in group:
            for l in all_lamps:
                l.hide_render = (l.name != L["id"])

            img = bpy.data.images.new(f"bake_{ai}_{L['channel']}", SIZE, SIZE,
                                      alpha=False, float_buffer=True)
            attach_target(shell, img)
            bpy.ops.object.select_all(action="DESELECT")
            shell.select_set(True)
            bpy.context.view_layer.objects.active = shell

            print(f"BAKING atlas{ai} {L['id']} -> {L['channel']} ({SAMPLES} spp)", flush=True)
            bpy.ops.object.bake(type="DIFFUSE")

            lum = read_luminance(img)
            lum_by_channel[L["channel"]] = lum
            peak[L["channel"]] = float(lum.max())
            print(f"  peak={peak[L['channel']]:.3f} mean={float(lum.mean()):.4f}", flush=True)
            bpy.data.images.remove(img)

        scales = {}
        for idx, ch in enumerate(("R", "G", "B")):
            if ch in lum_by_channel:
                s_ch = peak[ch] or 1.0
                scales[ch] = s_ch
                rgba[:, :, idx] = np.clip(lum_by_channel[ch] / s_ch, 0.0, 1.0)
            else:
                scales[ch] = 0.0
                rgba[:, :, idx] = 0.0

        packed = bpy.data.images.new(f"lightmap_{ai}", SIZE, SIZE, alpha=False, float_buffer=True)
        packed.pixels.foreach_set(rgba.reshape(-1))
        packed.filepath_raw = str(OUT / f"lightmap_{ai}.png")
        packed.file_format = "PNG"
        bpy.context.scene.render.image_settings.color_depth = "16"
        packed.save()

        atlases.append({
            "file": f"lightmap_{ai}.png",
            "scales": [scales.get("R", 0.0), scales.get("G", 0.0), scales.get("B", 0.0)],
            "channels": {L["channel"]: L["id"] for L in group},
        })

    world_bg.inputs[1].default_value = world_strength
    for l, (col, hide) in zip(all_lamps, original):
        l.data.color = col
        l.hide_render = hide

    meta = {"size": SIZE, "samples": SAMPLES, "atlases": atlases}
    (OUT / "lightmaps.json").write_text(json.dumps(meta, indent=2, ensure_ascii=False))
    bpy.ops.wm.save_as_mainfile(filepath=str(OUT / "house_baked.blend"))
    print("BAKE_OK", json.dumps({"atlases": len(atlases)}, ensure_ascii=False))


main()
