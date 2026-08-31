"""读 src/plan.json —— 户型的唯一数据源，Blender 和 three.js 共用同一份。"""
import json
from pathlib import Path

PLAN = json.loads((Path(__file__).resolve().parents[1] / "src" / "plan.json").read_text())

WALL_H = PLAN["wallH"]
WALL_T = PLAN["wallT"]
ROOMS = PLAN["rooms"]
EXTERIOR = PLAN["exterior"]
INTERIOR = PLAN["interior"]
LAMPS = PLAN["lamps"]
OCCLUDERS = PLAN["occluders"]

# 可烘焙的灯按三个一组打包成一张贴图，通道按组内位置自动分配 ——
# 手写 channel 太容易写重，同一张图里两盏灯抢同一个通道会互相覆盖。
BAKEABLE = [l for l in LAMPS if l.get("bake")]
ATLASES = []
for _i in range(0, len(BAKEABLE), 3):
    _group = BAKEABLE[_i:_i + 3]
    for _j, _l in enumerate(_group):
        _l["channel"] = "RGB"[_j]
    ATLASES.append(_group)

LIGHTMAP_SIZE = 1024

ALBEDO = {
    "wall":       (0.86, 0.84, 0.80),
    "woodFloor":  (0.42, 0.30, 0.19),
    "woodFloorWarm": (0.46, 0.33, 0.21),
    "tile":       (0.70, 0.68, 0.65),
    "ceiling":    (0.90, 0.89, 0.87),
    "tv_wall":    (0.20, 0.19, 0.17),
    "furniture":  (0.34, 0.30, 0.26),
}
