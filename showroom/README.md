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

页头的熊猫标识取自官网 <https://smartpanda.sg/> 的页头内联 SVG，原样保留在 `src/ui/PandaLogo.jsx`（单条 path，`fill="currentColor"`，所以深浅背景都能用）。**官网换 logo 时这里要同步**。

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
│   ├── index-xxxx.js          ~1.6 MB（gzip 后 ~480 KB）
│   ├── map/normal/rough-xxxx.webp   CC0 材质贴图，合计约 1.9 MB（按需懒加载）
│   ├── index-xxxx.css
│   └── studio_small_09_1k-xxxx.hdr   1.5 MB
├── models/sofa_03.glb          888 KB
├── favicon.svg
└── icons.svg
```

### 三个容易踩的坑

**1. 子目录路径** — Vite 默认按站点根目录生成资源路径，放进 `/showroom/` 就会 404。项目已经把 `vite.config.js` 的 `base` 设成 `'./'`（相对路径），放任意层级子目录都能跑，这一条不用你操心。

**2. MIME 类型** — `.glb` 和 `.hdr` 在多数共享主机上没有默认 MIME 类型，服务器可能按 `text/plain` 返回导致加载失败。`public/.htaccess` 里已经声明好了，**别忘了上传这个隐藏文件**（cPanel 文件管理器要先勾选「显示隐藏文件」）。

**3. gzip** — 未压缩的 JS 约 1.6 MB，gzip 后约 480 KB。`.htaccess` 里配了 `mod_deflate`，如果主机没开这个模块，可以在 cPanel 的「优化网站」里打开压缩。

### 另一种更省事的方式

`npm run build:single` 产出的 `dist-single/index.html` 是**自包含单文件**（约 7.3 MB，HDRI 和材质贴图都内联了）。直接把这一个文件传上去改名即可，不用管 MIME 和路径。

代价是每次访问都要重新下载完整的 7 MB 多 —— HDRI 和贴图无法被单独缓存。**给客户临时看用它，正式挂官网上用 `dist/`。**

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
- `loading="lazy"` 很重要 —— 首屏就加载一个含 HDRI 和贴图的 7 MB 页面会拖慢官网。
- 官网页头已经有 logo，嵌进去会重复。可以在样板间里开**专注模式**当默认（`store.js` 把 `focusMode` 初值改成 `true`），或者干脆把 `<Brand />` 从 `App.jsx` 去掉。
- 官网是浅色、样板间是深色，这个对比是刻意的：深色展示区嵌在浅色页面里是常规做法，不用强行统一。

## 单一数据源

每个户型一份 JSON：**`src/plans/3room.json`、`4room.json`、`5room.json`**，在 `src/plans/index.js` 登记。
一份文件里写全该户型的一切：房间矩形（面积之和 = `areaM2`）、墙与洞口（窗 / 门 / 推拉门 / 阳台矮墙）、灯位、家具、软装、地毯、窗帘、设备摆位、热点、相机视角。
组件（`Shell`、`Furniture`、`Decor`、`Curtains`、`Devices`、`Fixtures`、`Hotspots`、`Scene`、`ViewRail`）只认 `usePlan()` 给的数据，**不留任何户型坐标**。
Blender 脚本（`tools/plan.py`，`PLAN=3room` 选户型）读同一份。

约定：three.js Y-up，x 向东、z 向南；北立面是客厅/卧室窗，南面是组屋公共走廊（大门、厨房窗、铁闸）。
家具在本地坐标建模，正面朝 +z、长度沿 x，JSON 里 `rot` 用角度（0 南 / 90 东 / 180 北 / -90 西）。
房间视角可带 `fov`（小房间里 36° 只看得到一张床），`area` 决定进房间时亮哪几个设备标签。

### 户型切换

- 当前户型在 store 的 `planId`。
- 深链 `?plan=3room` / `4room` / `5room`，切换时用 `history.replaceState` 把参数写回地址栏，复制即可分享。
- 户型切换是画面左上方品牌区下方单独一行的分段按钮（radiogroup，方向键可切；手机排在顶部第二行），首次进入有一次性提示，已看过记在 localStorage。
- 切户型会把设备重置为初始状态、相机回全屋，加载屏在新户型首帧前盖住画面；户型只带它热点表里出现的实体（加环境传感器、所属插座在场时的功率传感器），面板标签和设备计数随之变化。
- 标定模式导出的是当前户型 JSON 的 `hotspots` 片段，标定值按 `户型:实体` 分开存。

### 户型与真实组屋的对照

| 户型 | 面积 | 布局要点 |
|---|---|---|
| 三房 | 66 ㎡ | 大门进短玄关，左手半开放厨房 + 服务阳台，右手避难所；客餐厅北向大窗；走廊尽头主卧带淋浴套卫；东南角是公共走廊让出的凹口 |
| 四房 | 90 ㎡ | 同上动线；客厅落地推拉门通小阳台；三间卧室 + 主卫 + 公卫；走廊 1.2 m |
| 五房 | 110 ㎡ | 四房基础上向西扩 2.2 m：书房、L 形大客餐厅、更大的厨房，服务阳台挪到西南角 |

共同点：避难所墙厚 240 mm、钢门、无窗；卧室门 0.85 m、卫生间门 0.75 m；铝合金窗带内外窗台；大门实木门 + 门外铁闸；主卫只有淋浴不带浴缸。

## 快速开始

```bash
npm install
npm run dev
```

## 它演示了什么

| 能力 | 说明 |
|---|---|
| 3D 户型 | **HDB 三房 / 四房 / 五房可切换**（66 / 90 / 110 ㎡）：玄关、半开放厨房 + 服务阳台、家庭避难所、主卧带套卫、公共卫生间；四房五房带小阳台 |
| 灯光联动 | 每个房间都有灯（四房卧室 3、五房书房与起居角也补齐了），支持开关、亮度、色温、RGB 调色，光照实时反映在场景中 |
| 窗帘 | 按 `current_position` 0–100 平滑开合，并真实遮挡阳光投影 |
| 电视 | 开机时屏幕自发光、画面亮度起伏，并向客厅投出冷色补光 |
| 空调 / 吊扇 / 热水器 | 分体空调（导风板 + 淡气流 + 毫米级运行灯）、三档吊扇、公卫与主卫储水式热水器（定时关闭） |
| 门锁 / 门磁 | 开锁 → 门向内打开（门磁 `binary_sensor.entry_door` on）→ 6 s 后关门 → 1.5 s 后自动反锁；锁面指示点：锁=红、开=绿；每一步都进事件流 |
| 新加坡特色设备 | 服务阳台智能晾衣架（升降 cover + 风干 fan + 照明 light）、洗衣机旁漏水传感器、厨房烟雾燃气报警、主卧除湿机（humidifier）、扫地机器人（vacuum，按路径清扫后回充） |
| 自动化演示 | 走廊人体存在传感器 +「有人自动开灯」开关；电视柜 / 书桌智能插座带功率读数；首页「当前功率」按设备状态推算（标注为演示估算） |
| 场景 | 回家 / 观影 / 用餐 / 睡眠 / 离家，一键切换整屋状态与时间氛围（在右侧面板「首页」页） |
| 控制面板 | 墙装触摸屏式：顶部房间标签（切标签相机缓动到该房间）+ 两列大磁贴，点一下开关，右上角「调节」展开内联滑块；只读传感器是虚线小状态条 |
| 加载屏 | `index.html` 里纯 CSS 的品牌加载屏（JS 执行前就可见），React 接管后盖到场景真正出第一帧再 400 ms 淡出；有贴图下载时显示真实的文件计数进度 |
| 时间轴 | 拖动即可从清晨到深夜，日光强度与色温连续变化 |
| 事件流 | 左下角实时打印 `state_changed`，结构与真实 HA 一致 |
| 材质 | 木地板、地砖、墙砖、乳胶漆、布艺、木皮、石英石用 CC0 PBR 贴图（Poly Haven / ambientCG，合计约 1.9 MB WebP，来源见仓库根 `ASSET_SOURCES.md`）；混凝土剖面、窗帘、地毯是程序化纹理；图片加载失败自动回退程序化 |
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

## 材质与贴图

**材质只在一处定义：`src/three/materials.js` 的 `MATERIALS` 表**。组件里一律 `getMat('veneer', { color })` 取共享材质（同参数只建一份）。

- 几何 UV 一律按「米」给：`RoundedBox` / 挤出体天生如此，墙地面在 `ProceduralShell` 里按世界坐标算，盒子类几何用 `metersUV()`。所以贴图密度只由表里的 `meters`（一张贴图对应的真实边长）决定，不会随房间、家具尺寸拉伸。地面按房间错开 UV 相位，木地板顺着房间长边铺。
- `img`：`src/assets/textures/<集>/{map,normal,rough}.webp`，canvas 创建时就开始懒加载（与 HDRI 并行，进度条可见）；手机加载 512 版本、跳过法线。
- `tex`：程序化回退（`textures.js`），首帧之后才逐张生成，不拖慢首帧。
- 换贴图：把新文件放进对应目录、在 `ASSET_SOURCES.md` 登记即可，组件不用改。
- 墙体：每段墙的两个大面按「朝向哪个房间」选材质 —— 厨卫贴砖到顶、居室乳胶漆 + 踢脚线、外立面单独一种漆、墙顶截面是混凝土剖面色。全部按材质合并成几张大网格（一种材质一次 draw call）。

## 光照与性能

- **开关灯绝不改变灯的数量或投影灯数量**：`light.visible` / `castShadow` 一变，three 会重编译全部 shader（以前点一下灯卡 0.9–2 s）。现在所有灯始终挂载、只改强度；投影灯在户型加载时固定选 4 盏主灯（手机 2 盏），点光源阴影只渲染一次（`shadow.autoUpdate = false`）。
- 3D 设备在 `useFrame` 里用 `useHA.getState()` 读状态，开关一个设备不触发 React 重渲；面板磁贴各自订阅自己的实体。
- 合成器会关掉渲染器的 tone mapping，所以后处理末尾补了一道 `ToneMapping(AgX)`；Bloom 阈值 1.0，只有灯罩会起光晕。
- **只有 light 域可以"发光"**：热点标记、设备指示灯、电视画面全部压在 Bloom 阈值以下，不照亮环境。
- `ContactShadows` 只算一帧；DPR 桌面 ≤1.75、手机 ≤1.5。

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

### 光照

现行三个户型（`plans/*.json` 里 `gi: "realtime"`）用实时点光源加一层很弱的天光。上一版 198 ㎡ 户型烘好的 lightmap 和壳体对不上新墙，所以运行时不再套那三张贴图，避免墙和光斑错位。重烘并确认贴图与对应户型 JSON 一致后，把 `gi` 改回 `"baked"` 即可重新挂上 `BakedShell`。

## 已经做了：全屋 Blender 烘焙 GI（上一版户型）

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
    Devices.jsx    分体空调、吊扇、热水器、门铃、晾衣架、扫地机、除湿机、插座、各类传感器
    Hotspots.jsx   3D 内可点击热点 + 拖拽标定
    materials.js   材质唯一定义处 + 贴图加载（图片 / 程序化回退）
    textures.js    程序化纹理（回退用）、挂画
    EntryDoor.jsx  大门：门扇开合 + 电子锁锁体
    Scene.jsx      Canvas 组装、相机预设、后处理
    ExternalHouse.jsx  外部 glTF 模型加载（可选）
  ui/
    Brand.jsx      左上品牌与工具按钮
    ViewRail.jsx   左侧视角切换
    Console.jsx    底部场景与时间轴
    ControlPanel.jsx 右侧触摸屏式面板（房间标签 + 磁贴；手机上变底部抽屉）
    PlanSwitch.jsx 户型分段按钮（首次进入有一次性提示）
    Loader.jsx     品牌加载屏（与 index.html 静态首屏同一套样式）
    EventLog.jsx   事件流
    CalibrationBar.jsx 标定面板
    icons.jsx      线性 SVG 图标集
  hooks.js       媒体查询（区分手机与桌面）
```

## 增加一个设备

1. 在 `src/ha/entities.js` 的 `INITIAL_ENTITIES` 里加一条，实体 ID 按 HA 规范写成 `domain.name`，`area` 决定它出现在面板的哪个房间标签；场景里需要的状态加到 `SCENES`。
2. 在各户型 JSON 的 `hotspots` 里加锚点（户型只带热点表里出现的实体）；灯加到 `lamps`，其他设备加到 `devices`（类型见 `Devices.jsx` 的 `KINDS`）。
3. 联动逻辑（定时、互锁）写在 `store.js` 的 `automations()`。

右侧面板按 `domain` 自动生成磁贴和调节条，不用改 UI 代码。

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
