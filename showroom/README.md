# Panda 智能家居 · 样板间（Home Assistant 演示版）

一个纯前端的 3D 智能家居样板间：在浏览器里俯视整套户型，点击房间里的设备热点或右侧面板即可开关灯、拉窗帘、开电视空调，画面实时给出真实的光照反馈。

**当前为演示模式**：所有设备状态由内置的模拟状态机驱动，不连接任何真实设备，因此不需要后端、不需要令牌、断网也能跑。

## 双语

界面默认英文，右上角第一个按钮一键切中文，选择存 localStorage。

- 界面字符串在 `src/i18n.js`
- 设备名 / 区域名 / 场景名跟着数据走，写在 `src/ha/entities.js` 里，形如 `{ en: 'Ceiling Light', zh: '客厅主灯' }`
- 组件里用 `const t = useT()`，界面串用 `t('key')`，数据里的双语字段用 `t.pick(value)`

3D 场景里的热点标签也跟着切换。要嵌进官网时，可以从外部直接设 `useHA.getState().setLang('zh')` 跟随官网的语言。

## 品牌标识

页头的熊猫标识取自官网 <https://pandasmarthome.xunleix8.workers.dev/> 的页头内联 SVG，原样保留在 `src/ui/PandaLogo.jsx`（单条 path，`fill="currentColor"`，所以深浅背景都能用）。**官网换 logo 时这里要同步**。

品牌绿官网用的是 `#1F8A5F`，在本项目的深墨背景上偏暗，取了提亮版 `#58c191` 作为 `--brand`，同时用在事件流的状态脉冲上。灯光相关的状态仍然是琥珀色 —— 那是"通电发光"的语义，不适合用品牌色顶替。

## 部署到 cPanel（或任何静态主机）

这是纯静态页面 —— **不需要 Node.js、不需要数据库、不需要任何后端**，共享主机足够。

### 步骤

```bash
npm run build          # 产物在 dist/
```

把 **`dist/` 目录里的全部内容**（包括隐藏的 `.htaccess`）上传到 cPanel 文件管理器的目标目录：

- 放整站根目录 → `public_html/`
- 放子目录 → `public_html/showroom/`，访问 `你的域名/showroom/`

上传后目录应该长这样：

```
public_html/showroom/
├── .htaccess
├── index.html
├── assets/
│   ├── index-xxxx.js          ~1.5 MB（gzip 后 ~440 KB）
│   ├── index-xxxx.css
│   └── studio_small_09_1k-xxxx.hdr   1.5 MB
├── models/sofa_03.glb          888 KB
├── favicon.svg
└── icons.svg
```

### 三个容易踩的坑

**1. 子目录路径** — Vite 默认按站点根目录生成资源路径，放进 `/showroom/` 就会 404。项目已经把 `vite.config.js` 的 `base` 设成 `'./'`（相对路径），放任意层级子目录都能跑，这一条不用你操心。

**2. MIME 类型** — `.glb` 和 `.hdr` 在多数共享主机上没有默认 MIME 类型，服务器可能按 `text/plain` 返回导致加载失败。`public/.htaccess` 里已经声明好了，**别忘了上传这个隐藏文件**（cPanel 文件管理器要先勾选「显示隐藏文件」）。

**3. gzip** — 未压缩的 JS 有 1.5 MB，gzip 后 440 KB。`.htaccess` 里配了 `mod_deflate`，如果主机没开这个模块，可以在 cPanel 的「优化网站」里打开压缩。

### 另一种更省事的方式

`npm run build:single` 产出的 `dist-single/index.html` 是**自包含单文件**（3.6 MB，HDRI 都内联了）。直接把这一个文件传上去改名即可，不用管 MIME 和路径。

代价是每次访问都要重新下载完整的 3.6 MB —— HDRI 无法被单独缓存。**给客户临时看用它，正式挂官网上用 `dist/`。**

## 嵌入到官网

构建出的 `dist-single/index.html` 是自包含单文件，最简单的嵌入方式是当成静态资源放到站点里，再用 iframe：

```html
<iframe
  src="/showroom/"
  title="Panda 智能家居样板间"
  style="width:100%;aspect-ratio:16/10;border:0;border-radius:16px"
  loading="lazy"
  allowfullscreen
></iframe>
```

几点提醒：

- 页面是全屏 3D 应用，iframe 要给足高度（建议 `aspect-ratio` 而不是固定 px），太矮会挤掉底部控制台。
- `loading="lazy"` 很重要 —— 首屏就加载一个含 HDRI 的 3.6 MB 页面会拖慢官网。
- 官网页头已经有 logo，嵌进去会重复。可以在样板间里开**专注模式**当默认（`store.js` 把 `focusMode` 初值改成 `true`），或者干脆把 `<Brand />` 从 `App.jsx` 去掉。
- 官网是浅色、样板间是深色，这个对比是刻意的：深色展示区嵌在浅色页面里是常规做法，不用强行统一。

## 单一数据源

户型、墙体洞口、灯位、家具遮挡体全部定义在 **`src/plan.json`**，
Blender 脚本（`tools/plan.py`）和 three.js（`src/three/utils.js`）读同一份。

之前两边各存一份常量，改一处忘另一处，烘出来的贴图就和运行时的模型对不上。
现在只有一个地方能改。

## 快速开始

```bash
npm install
npm run dev
```

## 它演示了什么

| 能力 | 说明 |
|---|---|
| 3D 户型 | **198 ㎡ 六个功能区**：客厅+餐厅、主卧、次卧、厨房、卫生间、走廊 |
| 灯光联动 | 6 路灯具，支持开关、亮度、色温、RGB 调色，光照实时反映在场景中 |
| 窗帘 | 按 `current_position` 0–100 平滑开合，并真实遮挡阳光投影 |
| 电视 | 开机时屏幕自发光、画面亮度起伏，并向客厅投出冷色补光 |
| 空调 / 新风 / 地暖 | 导风叶片、扇叶转动、地面暖光等状态可视化 |
| 场景 | 回家 / 观影 / 用餐 / 睡眠 / 离家，一键切换整屋状态与时间氛围 |
| 时间轴 | 拖动即可从清晨到深夜，日光强度与色温连续变化 |
| 事件流 | 左下角实时打印 `state_changed`，结构与真实 HA 一致 |
| 材质 | 木地板、瓷砖、布纹、地毯全部用 Canvas 2D 程序化生成，含法线与粗糙度贴图，不引用任何图片文件 |
| 热点标定 | 顶栏「标定」进入后可拖动 3D 里的设备锚点，导出坐标表，换模型后重新定位用 |
| 手机端 | 竖屏自适应：视场角与机位切换、控制面板变底部抽屉、标签默认收起 |

## 渲染

三件事撑起观感，按影响从大到小：

1. **环境光遮蔽（N8AO）** —— 没有它，家具底部和墙角均匀发亮，物体像浮在地面上。加上之后接触处有了暗部，纵深立刻出来。这是整套画面里性价比最高的一项。
2. **家具倒角** —— 所有家具走 `RoundedBox`，软包件用更大的圆角。真实家具没有绝对锐利的边，倒角边能接住高光，对"像不像实物"的影响比多做几个模型都大。
3. **窗外景观** —— 落地窗外原本是空的，窗户像贴在墙上的蓝色板子。补了中景树和远景天际线，都推到雾的起点之外，只作背景层次，不与房子争视线（也不破坏悬浮地台那种干净的背景）。

**动效克制**是个容易翻车的地方。曾经同时有五处在周期性变化：热点锚点呼吸缩放、空调冷气微光、地暖暖光、电视补光闪烁、电视屏幕亮度起伏。单看每一处都很微妙，叠起来整个画面就一直在闪 —— 尤其是热点锚点：它是自发光的、会被 Bloom 拾取，缩放一变光晕跟着胀缩，而默认就有六个设备亮着，六个锚点同频跳动。

现在只保留电视画面 ±5% 的亮度浮动（真实电视确实在变），其余全部改成静态。`AdaptiveDpr` 也去掉了 —— 它会在帧率抖动时反复升降渲染分辨率，配合 `pixelated` 就是肉眼可见的画面跳变，而这个场景本身很轻，用不着它。

再往上是一层软装与细节：

4. **窗帘褶皱** —— 不再是平板。每帧按开合度重算顶点位移，布收拢时褶皱变深变密，展开时几乎摊平。
5. **地板微反射** —— 客厅木地板与厨房瓷砖映出一点灯光和家具轮廓。每个反射材质都要多渲一遍场景，所以只给面积最大的两块地面开，手机端一律关闭。
6. **软装** —— 挂画、书本、花瓶、托盘杯子、砧板碗、调料罐、搭毯。画芯是程序化生成的抽象画：空墙上挂一块纯色矩形，比不挂还假。
7. **门扇** —— 门洞原本是空的，缺了门整个户型像未完工。做成半开，既有实物感又不挡 dollhouse 视线。

## 外部资源（CC0）

`assets-src/` 放原始下载文件，压缩后的成品在 `src/assets/` 与 `public/`。全部来自 [Poly Haven](https://polyhaven.com)，CC0 许可，可商用无需署名。

| 资源 | 用途 | 原始 | 成品 |
|---|---|---|---|
| `studio_small_09_1k.hdr` | 环境光照（IBL） | 1.5 MB | 内联进单文件构建 |
| `sofa_03` glTF (2K) | 沙发模型（默认关闭） | 1.7 MB | `public/models/sofa_03.glb` 888 KB |

### 一个值得记下的结论

试点换沙发模型时发现：**Poly Haven 全部 85 个家具模型里，绝大多数是 vintage / gothic / antique 风格**。现代风格的只有 `mid_century_lounge_chair`、`modern_coffee_table_01/02`、`side_table_01`、`modern_wooden_cabinet` 这几件 —— **一个现代沙发都没有**。

实测的 `Sofa 03` 材质细节确实碾压程序化（扫描级的皮革、缝线、织物花纹），但它是巴洛克古典沙发，放进现代简约的样板间非常违和。所以沙发保持程序化版本，`src/three/Furniture.jsx` 里的 `USE_MODEL_SOFA` 开关可以随时切回去对比。

**免费 CC0 库的风格覆盖有限，这一点比模型精度更需要提前考虑。**现代简约住宅家具基本要走商业库或自己建。

### HDRI 接入的坑

没用 drei 的 `<Environment files=...>` —— 它靠**文件扩展名**挑 loader，而单文件构建会把 HDRI 内联成 base64 data URI，没有扩展名可认，直接抛 `Unrecognized file extension`。改成自己走 `RGBELoader` + `PMREMGenerator`（`src/three/HdriEnvironment.jsx`），两种形式都能加载。

HDRI 本身是固定的白天环境，所以 `scene.environmentIntensity` 要跟着昼夜曲线走，否则夜里怎么关灯屋里都是亮的。接入 HDRI 后半球光和环境光也得相应压下去（从 0.95 降到 0.16），否则整个场景过曝。

### 压缩管线

```bash
# 贴图降到 1K（sips 是 macOS 自带）
for f in assets-src/sofa_03/textures/*.jpg; do sips -Z 1024 "$f" --out "$f"; done
# 打包成单文件 GLB
npx gltf-transform copy assets-src/sofa_03/sofa_03_2k.gltf step1.glb
npx gltf-transform dedup step1.glb step2.glb
npx gltf-transform prune step2.glb public/models/sofa_03.glb
```

没用 `gltf-transform optimize --texture-compress`，因为那需要 `sharp` 编译原生二进制。用系统自带的 `sips` 降分辨率效果一样，2K→1K 体积就降到四分之一。

## 程序化建模

家具不是简单的方块堆叠，几何全部由代码生成（`src/three/shapes.js`）：

| 手法 | 用在哪 |
|---|---|
| **超椭球软包** `pillowGeometry` | 沙发坐垫、靠背、扶手、抱枕、床垫、被子、枕头、软包床头 |
| **坐垫下陷** `cushionGeometry` | 沙发坐垫顶面压出浅坑，像被坐过 |
| **旋转体** `latheGeometry` | 吸顶灯盘、落地灯罩、台灯罩、花瓶、马克杯、碗 |
| **圆角挤出** `slabGeometry` / `panelGeometry` | 台面、座板、椅背，带一圈倒角 |
| **弯曲面板** `curvePanel` | 椅背沿宽度弯出贴合腰背的弧 |
| **锥形腿** `legGeometry` | 桌腿、椅腿，上粗下细 |

其中最有用的是**超椭球**：把立方体顶点投影到 `|x|ⁿ+|y|ⁿ+|z|ⁿ=1` 上，n=4~6 正好是"鼓起来的方"。圆角盒子只是把边磨圆，超椭球是整个面都微微鼓起——那才是布料被填充物撑开的样子。沙发拆成三块独立坐垫 + 两块靠背 + 两侧扶手，也比整块真实得多，真沙发本来就是一堆各自鼓起的软包摞在框架上。

所有静态几何在模块级共享一份，不会每个实例各建一次。

### 已经做了：全屋 Blender 烘焙 GI

整套户型的静态壳体（墙、地面）吃的都是 Blender Cycles 烘出来的全局光照。
九盏灯分三张贴图，每张的 R/G/B 各存一盏灯的完整 GI，运行时按开关状态加权求和 ——
**开关灯依然实时**，但每盏灯的光都带着真实的墙面反弹。

整屋共用一套 UV / 一份几何（50 KB glb），三张 512 贴图合计 570 KB。

完整管线、命令和踩过的坑见 [tools/README.md](tools/README.md)。

再往上走就是换真实建模的 glTF + 在 Blender 里烘焙 lightmap。程序化白模 + 实时光照的上限大致就在这里了：实时点光源没有间接光，房间角落永远缺一层反弹光。要注意的是这两件事得一起做 —— 单独换精细模型但仍用实时光照，提升有限；反过来白模配烘焙 GI 反而好看。**光照决定上限，模型决定下限。**

## 界面

界面刻意只有一套深色外观 —— 它浮在夜间室内渲染之上，中性色整体偏暖（带棕），和场景里的灯光同一个色温家族。强调色（琥珀）只用在「通电、发光」的状态上，冷色只用在制冷、开合度这类非发光的量。

布局把四类操作分到画面四角，不再堆叠：左上品牌与工具、左侧视角、底部中央场景与时间轴、右侧设备面板、左下事件流（默认折叠）。

界面可以让位给房子，两级收纳：

- **收起面板** —— 点面板右上角的箭头，右侧 316px 的设备面板收成 58px 的图标条。图标亮灭即状态，点一下直接开关，不用展开。底部控制台会自动占用腾出的空间。收起状态存 localStorage。
- **专注模式** —— 工具栏最右那个按钮，一键隐藏全部界面，只剩房子和右上角一个低调的退出按钮，Esc 也能退。给客户看纯净效果时用。

图标是一套内联 SVG 线稿，不用 emoji —— emoji 在不同系统渲染差异大，也和克制的语气不合。

字体：西文与数字用 Google Fonts 的 Instrument Serif 与 DM Mono，中文用系统的苹方。**断网时会退回系统字体，界面本身完整可用**，其余部分（3D、材质、状态机）本来就零外部依赖。

## 目录结构

```
src/
  ha/            模拟 Home Assistant 层
    entities.js    实体注册表 + 场景定义（改这里增删设备）
    store.js       状态机 + callService，接口与真实 HA 对齐
    format.js      状态文案格式化
  three/         3D 场景
    Shell.jsx      墙体、门窗、地面
    Furniture.jsx  家具
    Fixtures.jsx   灯具与光照（受实体状态驱动）
    Curtains.jsx   窗帘动画
    Devices.jsx    空调 / 新风 / 地暖的状态可视化
    Hotspots.jsx   3D 内可点击热点 + 拖拽标定
    textures.js    程序化材质生成（噪声、木纹、布纹、法线贴图）
    Scene.jsx      Canvas 组装、相机预设、后处理
    ExternalHouse.jsx  外部 glTF 模型加载（可选）
  ui/
    Brand.jsx      左上品牌与工具按钮
    ViewRail.jsx   左侧视角切换
    Console.jsx    底部场景与时间轴
    ControlPanel.jsx 右侧设备面板（手机上变底部抽屉）
    EventLog.jsx   事件流
    CalibrationBar.jsx 标定面板
    icons.jsx      线性 SVG 图标集
  hooks.js       媒体查询（区分手机与桌面）
```

## 增加一个设备

1. 在 `src/ha/entities.js` 的 `INITIAL_ENTITIES` 里加一条，实体 ID 按 HA 规范写成 `domain.name`。
2. 如果它需要在 3D 里有光或有动画，在 `src/three/Fixtures.jsx` 的 `LAMPS` 或 `Devices.jsx` 里加对应表现。
3. 在 `src/three/Hotspots.jsx` 的 `HOTSPOTS` 里加一个锚点坐标。

右侧控制面板会自动按 `domain` 渲染对应控件，不用改 UI 代码。

## 调整设备热点位置

换过模型或挪过家具后，热点位置要重新对。不用改代码试错：

1. 顶栏点「标定」；
2. 点任意热点选中，拖动 3D 里的箭头，或直接在左下面板改 X / Y / Z 数值；
3. 点「复制坐标表」，把生成的代码粘回 `src/three/Hotspots.jsx` 的 `HOTSPOTS`。

调整结果会存在 localStorage，刷新不丢；「还原默认」清空全部改动。

## 换成自己的户型模型

程序化白模只是默认值。有 glTF/GLB 模型时：

1. 把模型放到 `public/house.glb`；
2. 新建 `.env`，写入 `VITE_HOUSE_MODEL=/house.glb`；
3. 在 Blender 里给需要联动的物体加自定义属性 `ha_entity`（值如 `light.living_main`），导出 glTF 时勾选自定义属性；
4. 用上面的标定模式把热点挪到新模型的正确位置。

运行时会自动读取 `userData.ha_entity` 建立「实体 → 物体」映射（见 `ExternalHouse.jsx` 的 `collectEntityBindings`），新增设备只改模型，不用改代码。

## 将来接真实 Home Assistant

`store.js` 的 `callService(domain, service, entityId, data)` 与 HA 的 `call_service` 签名一致，替换时只需改这一层：

- 前端不要持有长期访问令牌。加一个薄后端（Node / FastAPI）代持令牌，前端只连自己的后端。
- 后端连 HA 的 WebSocket：`auth` → `get_states` → `subscribe_events`（`state_changed`），把事件推给前端替换本地状态机。
- 后端对可调用的服务做白名单，样板间对外展示时尤其必要。

## 构建

```bash
npm run build
```

`npm run build:single` 会额外产出一个自包含的单文件 `dist-single/index.html`，可直接发给客户在浏览器里打开。
