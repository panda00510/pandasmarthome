"""
把烘焙好的客厅壳体导出成 glb（带两套 UV：贴图 UV + lightmap UV）。

天花板在烘焙时必须存在（房间很大一部分光是从天花板反弹下来的），
但 dollhouse 视角不需要它，所以导出前把天花板的面删掉。

    blender -b tools/_work/house_baked.blend -P tools/export_shell.py
"""
import bpy, bmesh, sys
from pathlib import Path

OUT = Path(__file__).resolve().parent / "_work"


def drop_ceiling(obj):
    mesh = obj.data
    idx = {i for i, s in enumerate(obj.material_slots)
           if s.material and s.material.name == "M_ceiling"}
    if not idx:
        return 0
    bm = bmesh.new()
    bm.from_mesh(mesh)
    doomed = [f for f in bm.faces if f.material_index in idx]
    n = len(doomed)
    bmesh.ops.delete(bm, geom=doomed, context="FACES")
    bm.to_mesh(mesh)
    bm.free()
    return n


def main():
    # 只留壳体：遮挡体和灯不导出
    for o in list(bpy.data.objects):
        if o.name != "Shell":
            bpy.data.objects.remove(o, do_unlink=True)

    shell = bpy.data.objects["Shell"]
    removed = drop_ceiling(shell)

    bpy.ops.object.select_all(action="DESELECT")
    shell.select_set(True)
    bpy.context.view_layer.objects.active = shell

    path = OUT / "house.glb"
    bpy.ops.export_scene.gltf(
        filepath=str(path),
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_normals=True,
        export_texcoords=True,
        export_materials="EXPORT",
        export_yup=True,          # 转回 three.js 的 Y-up
    )

    print("EXPORT_OK")
    print("  ceiling faces removed:", removed)
    print("  uv layers:", [l.name for l in shell.data.uv_layers])
    print("  verts:", len(shell.data.vertices), "polys:", len(shell.data.polygons))
    print("  file:", path, path.stat().st_size, "bytes")


main()
