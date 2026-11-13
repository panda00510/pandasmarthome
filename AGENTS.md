# Panda Smart Home：协作约定与当前进度

项目怎么搭、怎么跑、怎么部署，看 [README.md](README.md)（权威文档，英文）。
展厅看 [showroom/README.md](showroom/README.md)。这里只记 README 里没有的东西：
约定、坑、进行中的工作。

## 约定

- **提交与上线：** 用户说“提交”或“部署”才提交、推送。推到 `main` 就会自动上线
  （`.github/workflows/deploy.yml`：GitHub Pages + Cloudflare Worker + IndexNow），
  所以没说“部署”时只能推到别的分支。
- **指南草稿：** 新指南先带 `draft: true`，用户说“发布”才去掉。
- **不用 `git add -A`**，只加明确的文件。
- **密钥与隐私：** API Key、`.env.local` 的内容、个人邮箱和电话不进仓库。
  本机 `.env.local` 里是真实联系方式，所以**本地构建出的 `dist/` 不能提交也不能拿去部署**。
- **不再向线上联系表单提交真实数据**，本地测试要拦截请求。
- **措辞：** 产品写“preparing / evaluating（筹备、评估）”，不写“developing / in-house（自研）”。
- **指南正文：** 不出现“Home Assistant”，不写价格。`/products/` 和 `/software/`
  两个页面是例外，它们有意提到这两样，别动。
- **回滚标签** `pre-redesign-20261108`、`pre-fix-20261109` 不要动。
- 指南的 Markdown 只支持 `##`/`###`、列表、加粗、链接、带标签的列表；
  **没有表格、图片、斜体**。常见问题一节不能放在最后。

## 环境里的坑

- Windows 上仓库根目录的 `dist/` 曾被别的进程锁住（EPERM）。遇到时把仓库拷到临时目录再构建
  （不拷 `node_modules`、`dist`、`dist-ssr`、`.git`、`.env*`，`node_modules` 用目录联接），
  `VITE_SITE_URL=https://smartpanda.sg npm run build`。
- Windows 的 Git Bash 里 heredoc 会吃掉反斜杠，改文件用编辑工具或 node 脚本。很多文件是 CRLF。
- 展厅截图用 `showroom/tools/capture.mjs`（用法在文件头）。必须用真 GPU，
  软件渲染太慢，截到的是相机还没到位的画面。

## 进行中：分支 `wip/review-fixes-showroom-20261113`

**都还没上线。** `main` 停在 `cce1715`，线上也是它。这个分支上有三件事：

### 1. 页面审查后的九项修改（已验证，等“部署”）

入场动画变轻（0.35 秒、10px、首屏标题不做动画）；首页“设备 + 软件”合成一条带状区
（小屏横向滑动）；手机顶栏只留一个语言链接；各区块间距收紧、Solutions 改细线网格、
Deliver 改三栏面板；Platform 示意图放大去边框；Contact 去掉卧室图库照片；
`/products/` 把产品卡提到价格标签后面；`/software/` 第五张卡跨两栏。
`en.ts` / `zh.ts` / `types.ts` 的文案没动。

已验证：typecheck、lint、构建 78 页；首页 1440px 高度 8,641 → 7,835px；
360–1440px 的 `/`、`/zh/`、`/products/`、`/software/` 无横向溢出。
没验证：`/software/` 第五张卡没单独截图看。

### 2. 展厅户型重做（已验证，等“部署”）

用户反馈原模型“有点大，不太像新加坡的户型”。改成约 93 ㎡ 的 HDB 四房 BTO
（12.6 m × 7.4 m）：北侧三间卧室一字排开，西端客餐厅，南侧是避难所、厨房、
公共卫生间、服务阳台，中间走廊。数据在 `showroom/src/plan.json`，
家具、设备、热点在 `showroom/src/three/*.jsx`。

房间视角（客厅、主卧、次卧、厨房、卫生间）从“站在房间里”改成“南侧上方俯视”，
因为模型没有天花板，室内机位配 36° 视场角只能看到家具局部。机位在 `Scene.jsx` 的 `VIEWS`。

已验证：桌面六个视角、`?lang=zh`、手机全屋和客厅视角，手机无横向溢出。
没验证：面板收起状态；手机上其余四个房间视角。
已知小问题：俯视时热点标签偶尔互相压住（客厅的窗帘和灯带）；
卫生间视角里近侧墙挡住一部分地面。

### 3. 首屏图换成展厅渲染图（没做完）

用户要求把首页首屏的图库照片换成展厅渲染图。原图已经截好：
`showroom/renders/overview-3200x2000.webp`（16:10，只有画布，没有界面）。还差：

1. 用它生成 `src/assets/photos/hero-showroom-{800,1200,1600}.webp`
   （参考 `scripts/make-photos.mjs`，它现在只处理 Pexels 原图）。
2. `src/components/sections/Hero.tsx` 和 `src/content/photos.ts` 换图、改 alt。
3. 图上的标签从“Illustrative photo / 示意图”改成如实的说法，
   比如“3D demo render / 3D 演示渲染图”（`en.ts`、`zh.ts`、`types.ts` 三处一起改）。
4. `ASSET_SOURCES.md` 和 `photos.ts` 里把 `hero-living` 移到“已停用”，新图记为自制。
5. 重新构建，看桌面和手机的首屏，确认无溢出。

### 另外：六篇指南草稿（等“发布”）

`src/content/guides/` 下六组 `*.en.md` / `*.zh.md`，都带 `draft: true`：
`after-installation-what-to-keep`、`zigbee-thread-wifi-which-for-what`、
`scenes-households-actually-use`、`holiday-mode-away-from-home`、
`know-what-each-appliance-uses`、`water-heater-automation-singapore`。
`src/content/guides.ts` 的 `TOPICS` 已加好对应条目。版式还没在浏览器里看过。

### 上线步骤

用户说“部署”后：把这个分支合进 `main`（先确认 `main` 没有别人的新提交），推送，
看 Actions 跑完，再到 https://smartpanda.sg/ 和 `/showroom/` 核对。
草稿没说“发布”就保持 `draft: true`，带着合进去也不会出现在站上。

## 还没得到答复的问题

- 首页现在同时讲三件事（智能家居方案、预订设备、定制软件）。到底主推哪一个？
  这决定首屏之后的区块顺序。
- 首页产品卡和 `/products/` 上的“Home Assistant”字样，是有意保留的例外吗？目前没动。
