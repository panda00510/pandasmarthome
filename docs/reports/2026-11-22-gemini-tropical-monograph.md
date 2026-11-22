# 2026-11-22 Tropical Monograph：Gemini 全新视觉方向

当前线上设计。由 Google Antigravity 里的 Gemini 4 Neon High 在本地仓库完成，经核对后提交并部署。

截图在 [gemini-redesign-2026-11-22/](gemini-redesign-2026-11-22/)：

| 文件 | 内容 |
|---|---|
| `before-{desktop,mobile}-{hero,full}.webp` | 改版前的首页。部署前从线上截取（深色 3D 样板间方向） |
| `after-{desktop,mobile}-{hero,full}.webp` | 改版后的首页。部署前在本地 `npm run preview` 截取 |
| `before-{desktop,mobile}-products-{hero,full}.webp` | 改版前的 `/products/` |
| `after-{desktop,mobile}-products-{hero,full}.webp` | 改版后的 `/products/` |

桌面宽 1440，手机宽 390。首屏裁切与此前报告一致（桌面顶部 893px，手机顶部 780px）。整页桌面图缩到宽 960。改版后的手机整页因超过 WebP 16383px 高度上限，按比例缩到高 16000（宽 322）。部署后的线上首屏与样板间另存在工作目录，未全部入库。

## 概念

**Tropical Monograph** — 日照石灰石（travertine）纸面、深植物绿、以及擦亮的建筑黄铜。标题用编辑感衬线，正文用 Inter，规格/协议/价格用等宽字体。

首屏是一次编辑式对页，而不是通屏深色 3D 舞台：顶部建筑元数据栏、纪念碑式衬线标题（斜体绿色强调句），右侧导语与按钮，下方是加框的 3D 样板间“展板”，旁边是交互式 Home 面板，底部是四栏规格账本。产品页是同一套系统下的工业设计目录。

3D 样板间本身（`/showroom/`）仍是独立构建，没有改交互或路线；站点里只把它当作展板和入口，不再当作整站的视觉身份。

## 色板

| 令牌 | Hex | 用途 |
|---|---|---|
| `--color-paper` | `#f4efe6` | 页面底，`theme-color`（light） |
| `--color-paper-alt` | `#eae2d4` | 交替浅色带 |
| `--color-surface` | `#fcfaf6` | 更浅的卡片/表面 |
| `--color-ink-950` | `#14221c` | 主墨、深色带、`theme-color`（dark） |
| `--color-ink-900` | `#18231e` | 正文接近黑的绿墨 |
| `--color-brand` | `#18523c` | 品牌绿（按钮、强调字） |
| `--color-bamboo-500` | `#256e51` | 植物绿阶（与品牌绿并列） |
| `--color-ember-300` | `#e5c48c` | 浅黄铜 |
| `--color-ember-400` | `#c8964e` | 黄铜 |
| `--color-ember-500` | `#9a6728` | 眉标、结构强调 |
| `--color-ember-600` | `#784d1a` | 深黄铜 |

`color-scheme` 为 `light`。`ink` 是一条暖绿黑阶，从 `#f7f3ec` 到 `#14221c`。

## 字体

- **标题（英文）** — `--font-display`：Iowan Old Style、Palatino Linotype、Book Antiqua、Georgia、Times，然后 Songti SC / Noto Serif CJK SC。字重 400，字距略收。
- **标题（中文）** — `--font-display-zh`：Songti SC、STSong、Noto Serif CJK SC 优先。
- **正文** — Inter（自托管可变字体，拉丁）+ 系统中文黑体（`--font-zh` / `--font-sans`）。
- **规格** — `--font-mono`：协议、编号、价格、页脚栏目名。

标题角色（约合）：`.title-display` 36 → 48 → 56px；`.title-section` 28 → 36px；`.title-article` ~31 → 40 → 44px；`.title-group` 22 → 24px；`.title-card` ~19px。没有引入外部标题字体 CDN。

## 版式

- 圆角改为建筑感的小圆角：`--radius-card` 0.25rem，`--radius-panel` 0.375rem（不再用原来 1.25 / 1.75rem 的大圆角卡片）。
- 页眉是浅色纸面栏 + 森林绿「预约咨询」按钮。页脚是深植物绿底，黄铜编号分栏。
- 深色只作对比色带：样板间区块、平台区块、页脚。首屏是浅色。
- 3D 渲染图保留，全部带 “3D showroom render / 3D 样板间渲染” 标签；产品线稿带 “Illustration / 示意图” 标签。
- 没有新造客户、评价、统计数字或照片。文案、价格和链接保持原样。

## 联系方式

联系信息仍然只来自环境变量（GitHub Actions 的 repository variables），仓库里不写死。Footer 和首页询价区在配置了 `VITE_CONTACT_EMAIL` / `VITE_WHATSAPP_NUMBER` 时渲染 `mailto:` 和 WhatsApp。本地 `npm run preview` 若没有 `.env.local`，会显示「联系方式待确认」，这是原有约定，不是这次改掉的。

2026-11-22 23:53 SGT 在已部署的 https://smartpanda.sg/ 上核对：首页 HTML 含 3 处 `mailto:sales@smartpanda.sg` 和 `wa.me/6580676515`；页脚可见 `sales@smartpanda.sg` 与 WhatsApp。电话和办公地址在改版前的线上也未出现（对应变量未配置），这次没有另写。页眉里改版前也没有邮箱。

## 3D 样板间链接

所有「体验 3D 样板间」按钮、页眉「3D showroom」、样板间色带、页脚和 404 页，都继续走 `src/lib/showroom.ts` 的 `showroomHref()`：英文 `/showroom/?lang=en`，中文 `/showroom/zh/`。与 `bd7af0b` 和改版前的线上一致，没有改路由。

本地只跑 `npm run build` 再 `npm run preview` 时，`dist/` 里没有样板间产物，访问 `/showroom/` 会落到主站 HTML，React 路由显示 404。这不是 href 写错。正常发布走 GitHub Actions：先构建 `showroom/`，再 `npm run build`，然后 `cp -R showroom/dist dist/showroom`。完整本地预览用 `npm run build:all`。

部署后核对：`https://smartpanda.sg/showroom/` 和 `/showroom/zh/` 返回 200，标题为 3D 样板间演示页，3D 房间可载入。

## 改了哪些文件

相对 `bd7af0b`，26 个文件，+1978 / −1396：

`index.html`，`src/index.css`，`src/App.tsx`，`src/components/ui.tsx`，`src/components/Choices.tsx`，`src/components/PageCta.tsx`，`src/components/brand/Wordmark.tsx`，`src/components/graphics/CardArt.tsx`，`src/components/graphics/HomePanel.tsx`，`src/components/layout/Header.tsx`，`src/components/layout/Footer.tsx`，以及首页/产品相关 sections：`Hero`、`Solutions`、`Showroom`、`Situations`、`Custom`、`Homes`、`Process`、`Deliver`、`Platform`、`Faq`、`Upcoming`、`Planner`、`Contact`、`ContactPage`、`Products`。

## 怎么做的

2026-11-22 晚，在本机 `/Users/xp/projects/pandasmarthome` 上用 Google Antigravity 桌面版（Gemini 4 Neon High，Auto 工具模式），项目直接打开这个已有仓库，没有另开 worktree，也没有改远程历史。

先做了一轮在原深色 3D 方向上的增量打磨。业主看过后认为还不是视觉上的跳跃，仍像同一套深色样板间站。那一轮的 diff 已另外存成补丁（本地 `~/.grokmon/gemini-polish-v1.patch`），没有单独提交。

第二轮要求丢掉深色 3D 舞台身份，自定一个鲜明、高端的方向（新色板、字体、版式和首屏），并说出概念名称。Gemini 选定 “Tropical Monograph”，改了首页、产品页和共用 Header / Footer，并用 Visual Design Verifier 在英文/中文、桌面 1440 与手机 390 下看过渲染结果。全程未提交、未推送，直到业主批准采用这一版。

## 构建

在本机独立重跑（23:43–23:44 SGT）：

- `npm run lint` — 通过，exit 0
- `npm run typecheck` — 通过，exit 0
- `npm run build` — 通过，exit 0；`tsc -b`、client + SSR，预渲染 130 页

Vite 仍有原有的 `INEFFECTIVE_DYNAMIC_IMPORT` 警告（`entry-server.tsx` 静态引用），不是新的失败。

## 部署

- 提交：`bc9ef1947b523a128a075f527f5b815ba98a61dd`（短哈希 `bc9ef19`）
- 说明：`Design: Tropical Monograph redesign by Gemini`
- 先 `git pull --rebase origin main`（远程没有新提交），再 `git push origin main`。没有 force-push。
- GitHub Actions Deploy：[run 45040541454](https://github.com/panda00510/pandasmarthome/actions/runs/45040541454)，push 触发，成功。Cloudflare 在 23:52:02 SGT 完成，GitHub Pages 在 23:52:18 SGT 完成。构建步骤里包含「把样板间拷进 dist」以及「联系方式必须进到打包产物」。

## 线上核对（23:53 SGT）

下列地址均返回 200，主站页面含 `theme-color` `#f4efe6`：

- https://smartpanda.sg/ — 新首屏文案 “A home that answers to you, not to the cloud.”；`sales@smartpanda.sg`；`wa.me/6580676515`
- https://smartpanda.sg/products/
- https://smartpanda.sg/zh/
- https://smartpanda.sg/zh/products/
- https://smartpanda.sg/solutions/
- https://smartpanda.sg/guides/
- https://smartpanda.sg/faq/
- https://smartpanda.sg/contact/
- https://smartpanda.sg/how-it-works/
- https://smartpanda.sg/about/
- https://smartpanda.sg/compare/
- https://smartpanda.sg/homes/
- https://smartpanda.sg/showroom/ — 200，标题 “3D Smart Home Showroom — HDB Flat Demo | Panda Smart Home”，3D 房间可打开
- https://smartpanda.sg/showroom/zh/ — 200，中文样板间标题

## 观感

和当天稍早的深色 3D 样板间站（以及第一轮只做打磨的补丁）相比，这是一次真正的视觉换向：暖纸面、衬线大标题、目录式产品页、森林绿与黄铜点缀。3D 渲染还在，但不再是整站的舞台。系统衬线字体在不同操作系统上会略有差别；样板间、平台和页脚仍使用深色对比带，这是有意的。
