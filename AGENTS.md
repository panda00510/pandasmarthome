# AGENTS.md — Panda Smart Home 官网

本文件是 Claude Code 与 Codex 共用的项目记忆。`CLAUDE.md` 只有一行 `@AGENTS.md`，
不要在两处写重复内容。README 是英文正文，保持英文；本文件用中文。

## 项目是什么

Panda Smart Home（Panda智能家居）的双语静态营销站，线上 <https://smartpanda.sg>。
英文在 `/`，中文在 `/zh/`，无后端。Vite + React 19 + TypeScript + Tailwind CSS v4。

业务线：
- **智能家居**：新加坡住宅（HDB / BTO / 公寓 / 有地）的设计与安装 —— `/solutions/…`、`/homes/…`、`/how-it-works/`、`/guides/…`
- **产品**：桌面屏幕设备（预购中）+ 随方案供货安装的设备 —— `/products/`；Panda Signage 信息屏与会议室门牌 —— `/signage/`
- **硬件定制**：ESP32 AI / IoT 设备 —— `/custom-hardware/`
- **软件定制**：小店与小生意的预约、库存、机器人、内部工具 —— `/software/`
- 另有 **3D 样板间** `/showroom/`（独立构建）；**关于我们** `/about/`、**隐私政策** `/privacy/`（`src/content/pages/` 下的 md）

## 权威文档

**README.md 是权威文档。** 动手前先读相关章节；改动涉及它描述的范围（脚本、环境变量、
目录、SEO、部署、品牌）时，收尾同步更新 README，别让它和代码漂移。
其他：`showroom/README.md`（样板间，中文）、`SEO_GEO_PLAN.md`、`ASSET_SOURCES.md`（素材来源与授权）。

## 目录与两个构建

- `src/`：主站。`content/`（全部文案）、`config/`（brand / site / ogImages）、`components/`、`entry-server.tsx`（预渲染入口、sitemap、robots、llms.txt）
- `scripts/`：`prerender.mjs`（每页每语言一份静态 HTML）、`make-og.mjs`（品牌 PNG 与分享图）、`indexnow.mjs`
- `worker/`：Cloudflare Worker（301 跳转 + 安全头），`wrangler.jsonc`
- `serverless/telegram-relay.js`：可选的表单 → Telegram 中转 Worker
- `showroom/`：独立 Vite 项目（JS），不参与主站 lint / typecheck；产物不入库
- 两个构建：`npm run build` 只建主站；`npm run build:all` = 主站 + showroom，并复制到 `dist/showroom/`

## 常用命令

```bash
npm run lint && npm run typecheck && npm run build   # 改完必跑
VITE_SITE_URL=https://smartpanda.sg npm run build    # 检查 canonical / og:image 等绝对地址
npm run build:all && npm run preview                 # 本地看主站 + 样板间（4173）
npm run og                                           # 重新生成 favicon / 图标 / 分享图（仅 macOS 生成分享卡）
node serverless/telegram-relay.test.mjs              # 中转 Worker 自检
node worker/index.test.mjs                           # 站点 Worker 自检
```

## 部署

- 推 `main` → `.github/workflows/deploy.yml` 一次运行同时发布 **GitHub Pages**（副本，`BASE_PATH=/pandasmarthome/`）与 **Cloudflare**（根路径，canonical）。CI 先跑 lint、typecheck、两个 Worker 自检，并检查 `VITE_*` 是否真的进了包。
- canonical 是 `https://smartpanda.sg`（`VITE_SITE_URL`）；www 与旧 workers.dev 地址由 Worker 301。
- **不要用 Cloudflare Workers Builds**（必须保持断开），否则两条流水线互相覆盖。原因见 README「Why not Cloudflare Workers Builds」。
- 配置来自 GitHub 仓库变量（Actions → Variables），本地是 `.env.local`（不入库）。

## 内容约定

- 用户可见文案只在 `src/content/en.ts` 与 `zh.ts`，类型在 `types.ts`；**两种语言同一批改**（类型检查会拦住只改一边）。
- 指南 / 专题页是 `src/content/guides/`、`src/content/pages/` 下的 `<slug>.en.md` + `.zh.md`，两种语言都必须有。
- 例外：分享卡的文字与 alt 在 `src/config/ogImages.ts`（生成脚本要直接 import，必须自包含）。

## 红线

- **不编造**价格、库存、客户、评价、案例、认证、奖项、合作关系、成立时间、联系方式。要加就带证据、有意识地加。
- 联系方式只来自 `VITE_*` 环境变量；没配就不显示，绝不放占位值。
- `VITE_*` 会被内联进前端包，**绝不放密钥**。`VITE_FORM_ACCESS_KEY` 是公开提交 key，例外。
- Telegram bot token 只在 Worker 里，前端永远不直接调 Telegram API。
- 结构化数据不写虚假 `review` / `aggregateRating`。
- 预购设备**暂不使用 Product / Offer 标记**（无可购买、无照片、无配送退货政策，Google 商家检查只会报错）——原因见 `src/components/Seo.tsx` 中 productList 的注释。
- 不把管理后台、数据库控制台之类暴露给普通用户。

## 设计约定

- bamboo 绿是唯一强调色；`ember` 只用于灯光 / 舒适度语境。设计令牌全在 `src/index.css`。
- 熊猫标识几何**只在** `src/components/brand/pandaPath.ts`；favicon、og-image.svg、分享卡都由 `npm run og` 从它生成，别手抄 path、别手改 `public/favicon.svg`。熊猫只用于 logo / favicon / 分享卡。
- 图库照片必须标明 illustrative（`PhotoTag` + alt 以 "Illustrative photo" 开头），不能冒充本公司案例。
- 分享卡（`public/og/*.png`）在 macOS 本机生成并**提交入库**，CI 不生成（Ubuntu 无苹方，中文会缺字）。改后逐张看图，每张 ≤ 60 KB。

## 样板间约定（详见 showroom/README.md）

- 每个户型一份 `showroom/src/plans/*.json`，是该户型的唯一数据源，在 `plans/index.js` 登记。
- 材质只在 `showroom/src/three/materials.js` 定义，组件用 `getMat()` 取共享材质。
- 只有 `light` 域设备才表现为发光 / 照亮环境；其他指示灯、屏幕都压在 Bloom 阈值以下。

## 验证习惯

- 改完跑 `npm run lint && npm run typecheck && npm run build`。
- 内置浏览器窗格隐藏时 WebGL 不出帧，样板间截图 / 交互验证用 Playwright。
- 改 SEO / 分享图时，用 `VITE_SITE_URL=https://smartpanda.sg` 构建后直接查 `dist/**/index.html`。

## 提交信息

英文，祈使句标题，常带范围前缀（`Signage: …`、`SEO: …`、`Showroom: …`）；
正文说明做了什么和为什么，具体数字与取舍写清楚。只在被要求时提交 / 推送。

## 待站长处理（2026-11-13 记；办完一项删一项）

站长说这些下次再做。开工前先问站长要处理哪几项，不要自己编内容去填。
本仓库是公开的，这里只记可以公开的事项。

**配置（GitHub 仓库 → Settings → Variables，改完重跑部署）**
- 转化统计：设 `VITE_PLAUSIBLE_DOMAIN`（先在 Plausible 注册该站点）或 `VITE_GA_MEASUREMENT_ID`。
  未配置时不加载任何统计脚本。启用 GA 或更换表单服务后，同步改 `/privacy/` 并更新其 `updated` 日期。
- 公司信息：`VITE_COMPANY_NAME` / `_ZH`、`VITE_COMPANY_REGISTRATION_NO`、`VITE_OFFICE_ADDRESS_*`。
  配好后自动显示在 `/about/`、`/privacy/` 底部和 JSON-LD 里。
- 品牌邮箱，以及是否单设个人数据请求邮箱（现在用 `VITE_CONTACT_EMAIL`）。

**需要站长提供的真实素材**
- `/about/`：成立时间、团队介绍、真实照片。
- 真实安装现场照片（替换首页户型卡片的图库图）、客户评价、Google Business Profile。
- 预购设备的实物照片、运费、退货政策——齐了才恢复 Product 结构化标记（见 `Seo.tsx` 注释）；
  有真实评价后再加 review / aggregateRating。
- Panda Signage 的管理后台或门牌真实截图（现在是线稿示意图）。
- "新加坡智能家居多少钱"这篇指南需要真实价格区间才能写。

**需要站长确认或决定**
- 确认或调整参考起步价：硬件定制 S$150 / S$350 / S$800；Panda Signage 部署 S$800、
  每加一块屏 S$60、会议室门牌 S$400。
- Panda Signage：是否提供代为托管（页面写"按项目评估"）；除 Android 11+ 外还能宣称支持哪些平台、
  有无实测过的播放盒型号；交付时是否给源码。
- 表单统计口径：走邮件客户端兜底也记为 `contact_form_submit`（带 `method: mailto`）；
  只想统计真正提交成功的话，删 `Contact.tsx` 里那一行。
- 隐私政策请律师或 PDPA 专业人士过目（跨境传输、撤回同意的处理时限两处尤其要看）。

**需要站长亲自操作**
- Search Console：商家信息报告点"验证修复"；Google 和 Bing 各重新提交 sitemap。
  "备用网页（有适当的规范标记）"是正常现象，不用处理。
- 通读 2026-11-13 发布的 5 篇指南、各指南开头的要点，以及硬件定制 / 信息屏 / 关于我们的中文文案。
  HDB 装修那篇里 "Directory of Renovation Contractors" 的中文名是自译，需核对。
- 另一台电脑若有未推送的本地改动：先 `git pull`，有冲突再处理。

**技术尾项（不急）**
- 指南每篇文章没有单独的分享图（共用一张）；样板间只有英文分享图。
- 样板间再次访问约 1.8 秒离开加载屏，目标 1.5 秒。
- 未上 CSP；上的时候按 README "Conversion events" 一节放行统计域名。
