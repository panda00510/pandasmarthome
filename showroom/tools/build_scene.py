"""
按 src/plan.json 在 Blender 里重建整套户型的静态壳体，展开一套共享的 lightmap UV。

整屋共用一套 UV / 一份几何，光照分三张贴图（每张三盏灯）——
比每个房间各一张省贴图，也省 draw call。

    blender -b --factory-startup -noaudio -P tools/build_scene.py
"""
import bpy, sys, math
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import plan

OUT = Path(__file__).resolve().parent / "_work"
OUT.mkdir(exist_ok=True)

to_blender = lambda x, y, z: (x, -z, y)          # three.js Y-up -> Blender Z-up
size_blender = lambda sx, sy, sz: (sx, sz, sy)


def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    sc.cycles.device = "GPU"
    prefs = bpy.context.preferences.addons.get("cycles")
    if prefs:
        prefs.preferences.compute_device_type = "METAL"
        prefs.preferences.get_devices()
        for d in prefs.preferences.devices:
            d.use = d.type != "CPU"
    sc.world = bpy.data.worlds.new("World")
    sc.world.use_nodes = True
    bg = sc.world.node_tree.nodes["Background"]
    bg.inputs[0].default_value = (0.35, 0.42, 0.52, 1.0)
    bg.inputs[1].default_value = 0.35


def material(key):
    name = f"M_{key}"
    if name in bpy.data.materials:
        return bpy.data.materials[name]
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    r, g, b = plan.ALBEDO.get(key, plan.ALBEDO["wall"])
    bsdf.inputs["Base Color"].default_value = (r, g, b, 1.0)
    bsdf.inputs["Roughness"].default_value = 0.85
    if "Specular IOR Level" in bsdf.inputs:
        bsdf.inputs["Specular IOR Level"].default_value = 0.3
    return mat


def add_box(name, center, size, key):
    bpy.ops.mesh.primitive_cube_add(size=1, location=to_blender(*center))
    o = bpy.context.active_object
    o.name = name
    o.scale = size_blender(*size)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    o.data.materials.append(material(key))
    return o


def wall_segments(start, end, holes, height):
    """按洞口把一段墙切成实体块"""
    segs, cursor = [], start
    for h in sorted(holes, key=lambda h: h["from"]):
        if h["from"] > cursor:
            segs.append((cursor, h["from"], 0.0, height))
        if h["y0"] > 0:
            segs.append((h["from"], h["to"], 0.0, h["y0"]))
        if h["y1"] < height:
            segs.append((h["from"], h["to"], h["y1"], height))
        cursor = h["to"]
    if cursor < end:
        segs.append((cursor, end, 0.0, height))
    return segs


def build_walls(defs, prefix, key="wall"):
    H, T = plan.WALL_H, plan.WALL_T
    out = []
    for w in defs:
        for i, (a, b, y0, y1) in enumerate(wall_segments(w["from"], w["to"], w.get("holes", []), H)):
            if b - a < 1e-4 or y1 - y0 < 1e-4:
                continue
            name = f"{prefix}_{w['id']}_{i}"
            if w["axis"] == "x":
                out.append(add_box(name, ((a + b) / 2, (y0 + y1) / 2, w["at"]), (b - a, y1 - y0, T), key))
            else:
                out.append(add_box(name, (w["at"], (y0 + y1) / 2, (a + b) / 2), (T, y1 - y0, b - a), key))
    return out


def build_shell():
    parts = []
    H = plan.WALL_H

    for rid, r in plan.ROOMS.items():
        cx, cz = (r["x0"] + r["x1"]) / 2, (r["z0"] + r["z1"]) / 2
        w, d = r["x1"] - r["x0"], r["z1"] - r["z0"]
        parts.append(add_box(f"Floor_{rid}", (cx, -0.01, cz), (w, 0.02, d), r["floor"]))
        # 天花板：烘焙必须有，导出前删掉
        parts.append(add_box(f"Ceiling_{rid}", (cx, H + 0.01, cz), (w, 0.02, d), "ceiling"))

    parts += build_walls(plan.EXTERIOR, "Ext")
    parts += build_walls(plan.INTERIOR, "Int")

    # 客厅电视背景墙饰面
    parts.append(add_box("TvWall", (-5.4, 1.36, -5.4), (5.0, 2.72, 0.06), "tv_wall"))
    return parts


def build_occluders():
    return [add_box(f"OCC_{n}", (cx, cy, cz), (sx, sy, sz), "furniture")
            for n, cx, cy, cz, sx, sy, sz in plan.OCCLUDERS]


def kelvin_to_rgb(k):
    t = max(1000, min(12000, k)) / 100
    if t <= 66:
        r, g = 255, 99.4708025861 * math.log(t) - 161.1195681661
    else:
        r = 329.698727446 * (t - 60) ** -0.1332047592
        g = 288.1221695283 * (t - 60) ** -0.0755148492
    b = 255 if t >= 66 else (0 if t <= 19 else 138.5177312231 * math.log(t - 10) - 305.0447927307)
    c = lambda v: max(0.0, min(255.0, v)) / 255
    return (c(r), c(g), c(b))


def build_lamps():
    out = []
    for L in plan.LAMPS:
        data = bpy.data.lights.new(L["id"], type="AREA")
        if L["kind"] == "strip":
            data.shape = "RECTANGLE"
            data.size, data.size_y = L["size"]
        else:
            data.shape = "DISK"
            data.size = L["size"]
        data.energy = L["power"]
        data.color = kelvin_to_rgb(L["kelvin"])
        o = bpy.data.objects.new(L["id"], data)
        o.location = to_blender(*L["pos"])
        bpy.context.collection.objects.link(o)
        out.append(o)
    return out


def join_and_unwrap(parts):
    bpy.ops.object.select_all(action="DESELECT")
    for p in parts:
        p.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]
    bpy.ops.object.join()
    shell = bpy.context.active_object
    shell.name = "Shell"

    mesh = shell.data
    while len(mesh.uv_layers) > 1:
        mesh.uv_layers.remove(mesh.uv_layers[-1])
    lm = mesh.uv_layers.get("Lightmap") or mesh.uv_layers.new(name="Lightmap")
    mesh.uv_layers.active = lm

    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=0.006)
    bpy.ops.object.mode_set(mode="OBJECT")
    return shell


def main():
    reset_scene()
    shell = join_and_unwrap(build_shell())
    occ = build_occluders()
    lamps = build_lamps()
    bpy.ops.wm.save_as_mainfile(filepath=str(OUT / "house.blend"))

    print("BUILD_OK")
    print("  rooms:", len(plan.ROOMS), " shell polys:", len(shell.data.polygons))
    print("  uv layers:", [l.name for l in shell.data.uv_layers])
    print("  occluders:", len(occ), " lamps:", len(lamps))
    print("  atlases:", [[l["id"] for l in a] for a in plan.ATLASES])


main()
