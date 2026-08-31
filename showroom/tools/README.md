# Blender 烘焙管线

把 Cycles 算出来的全局光照烘成贴图，让 three.js 里的房间有真实的光线反弹，
同时保留实时开关灯的能力。

## 为什么要这一步

实时点光源没有间接光 —— 墙面不会把光反弹回房间，角落永远缺一层。
这是程序化 + 实时光照的天花板，也是「很好的演示」和「像效果图」之间那道坎。

## 通道打包

一张贴图的 R / G / B 三个通道，各存**一盏灯**烘好的完整 GI（含它自己的间接反弹）。
运行时按每盏灯当前的开关、亮度、颜色加权求和：

```glsl
vec3 lm = texture2D(uLightmap, vLightmapUv).rgb * uLightmapScale;
vec3 baked = lm.r * uLmIntensity.x * uLmColorR
           + lm.g * uLmIntensity.y * uLmColorG
           + lm.b * uLmIntensity.z * uLmColorB;
reflectedLight.indirectDiffuse += baked * diffuseColor.rgb;
```

**开关灯依然是实时的**，但每盏灯的光都带着 Cycles 算出来的墙面反弹。
三盏灯一张图，客厅刚好用满。

## 跑一遍

```bash
# 1. 在 Blender 里重建客厅壳体，展开 lightmap UV
blender -b --factory-startup -noaudio -P tools/build_scene.py

# 2. 逐灯烘焙（BAKE_SAMPLES 控制采样，正式出图用 192+）
BAKE_SAMPLES=192 blender -b tools/_work/living.blend -P tools/bake_lightmap.py

# 3. 导出带两套 UV 的壳体
blender -b tools/_work/living_baked.blend -P tools/export_shell.py

# 4. 贴图压到 512（8 位），装进项目
sips -Z 512 tools/_work/lightmap_living.png --out src/assets/baked/lightmap_living.png
cp tools/_work/shell_living.glb src/assets/baked/
cp tools/_work/lightmap_living.json src/three/
```

`tools/plan.py` 里的户型和灯位**必须和 `src/three/utils.js`、`Fixtures.jsx` 对齐**，
差一点烘出来的贴图就和运行时的模型对不上。

## 三个容易踩的坑

**1. 环境光会被算三遍**
每次只开一盏灯烘，但 world 的环境光对每次烘焙都有贡献，三个通道叠加就是三倍环境光。
烘焙期间必须把 world 强度归零，环境光和日光留给运行时实时算。

**2. 烘焙光和实时光会叠成双份**
壳体既吃 lightmap 又被实时点光源照，光就翻倍了。用 three.js 的 layers 隔离：
壳体放 `layer 1`，客厅那三盏点光源只在 `layer 0`，日光和天光两个 layer 都照。
相机记得 `camera.layers.enable(1)`，否则壳体直接不可见。

**3. 单位不对应**
Blender 的面光用瓦特，three.js 的点光源用坎德拉，两套单位没有直接换算。
`LivingShell.jsx` 里的 `LIGHTMAP_CALIBRATION` 是经验标定值，改 `plan.py` 的灯功率后要重标。

## 烘焙时的取舍

- **天花板必须存在**：房间很大一部分光是从天花板反弹下来的，没有它烘出来的光会明显偏暗。
  但 dollhouse 视角不需要看到它，所以 `export_shell.py` 在导出前把天花板的面删掉。
- **灯统一用白光烘**，存的是纯强度，颜色/色温在运行时由 shader 乘上去 —— 这样用户调色温仍然有效。
  代价是丢失彩色反弹（墙面把灯光染色再反射的那部分）。
- **家具只作为遮挡体**参与烘焙，不接受烘焙、不导出。所以地面上有家具的影子，但家具本身仍走实时光照。

## 目前的范围

**全屋六个房间**都烘了，九盏灯分三张 atlas：

| atlas | R | G | B |
|---|---|---|---|
| 0 | 客厅主灯 | 客厅灯带 | 餐吊灯 |
| 1 | 主卧吸顶 | 床头灯 | 次卧吸顶 |
| 2 | 厨房射灯 | 镜前灯 | 走廊筒灯 |

整屋共用一套 UV，所以三张贴图叠加就是全屋完整光照。落地灯不烘（`plan.json` 里 `bake: false`）——
它是可移动的小灯，走实时光照更合理。

再加灯只需在 `src/plan.json` 的 `lamps` 里追加，通道会按分组顺序自动分配。

## 第四个坑：通道别手写

`plan.json` 里一度手写了每盏灯的 `channel`，结果同一张 atlas 里三盏灯都写成了 R，
后烘的把先烘的直接覆盖 —— 画面上表现为某些灯"点了没反应"。
现在通道由 `tools/plan.py` 按组内位置自动分配（第 0/1/2 盏 → R/G/B），不再有手写的机会。

另外每个通道**独立归一化**：各盏灯的峰值差好几倍（1.1 到 6.0），
共用一个系数会让弱光那一路精度严重不足。
