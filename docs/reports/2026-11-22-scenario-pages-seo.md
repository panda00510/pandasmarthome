# 2026-11-22 场景方案页 + 新页面结构化数据

## 1. 场景方案页

### 选题

站上已有两套栏目：
- `/solutions/…`：按设备分（灯光、空调、窗帘、门锁、控制、用电监测）。
- `/homes/…`：按住宅类型分（BTO、转售组屋、公寓、有地、老房子）。

有地住宅和公寓已经在 `/homes/` 下有页面，所以没有再做，免得重复栏目。新页按**使用情境**来组织，只选现有方案页和指南已经覆盖得住的三个情境：

| 页面 | 路径 | 内容来源 |
|---|---|---|
| 出门在外 / Away from home | `/solutions/away-from-home/` | 门锁页的离家模式，灯光页的“出门一键全关”，空调页的“最后一人离开就关、快到家先预冷”，漏水烟雾传感器指南，防潮除湿指南，帮佣访客权限指南，断网指南 |
| 睡前与夜间 / Bedtime and nights | `/solutions/nights-and-sleep/` | 控制方式页的床边按键，门锁页的夜间模式，空调页的“入睡后调高一两度”，灯光页的夜灯，人体存在传感器指南，窗帘页的“随晨光打开、挡西晒”，防潮指南的“没人睡时才开除湿”，长辈指南的夜灯 |
| 几代同住 / Family home | `/solutions/family-home/` | 控制方式页的“三类人三种控制”，帮佣、孩子、访客权限指南，长辈指南，雷达跌倒检测指南，隐私指南 |

### 没写的内容

- 价格、案例、客户、照片和统计数字。
- “模拟有人在家”（出门时定时开关灯）。站上任何一页都没写过这项能力，所以没写。
- 一处没有出处的说法：初稿里有“进门头十分钟不用等”，已删掉。

### 实现

- 文案：`src/content/pages/scenario-{away,nights,family}.{en,zh}.md`。用的是现有的主题页机制（front matter 里的 `path` 和 `related`），所以页面、预渲染、sitemap 和 llms 都会自动带上它们。
- `/solutions/` 总览页（`Hub.tsx`）：在原来的设备卡片下面加了第二排“按情境看”。登记表是 `SITUATIONS`；卡片渲染抽成了 `IconCards`，与设备卡片共用。新增的小标题文案是 `hubs.solutions.situations`（中英文各一份）。
- 内链：
  - 门锁页“离家、在家和夜间模式”链到出门在外页、睡前与夜间页。
  - 灯光页“夜灯”链到睡前与夜间页。
  - 控制方式页链到几代同住页。
  - 三个新页本身也链到 9 个已有方案页和 10 篇已有指南。

## 2. SEO：sitemap 与结构化数据

### 现状核对（本地构建，`VITE_SITE_URL=https://smartpanda.sg`）

| 页面 | sitemap | JSON-LD（改动前） |
|---|---|---|
| `/faq/`（中英） | 有 | LocalBusiness、FAQPage（33 问）、WebPage、BreadcrumbList、WebSite，不缺 |
| `/contact/`（中英） | 有 | LocalBusiness、ContactPage、BreadcrumbList、WebSite，不缺 |
| `/compare/`（中英） | 有 | 只有 WebPage 和 BreadcrumbList，**没有说明它比较的是什么** |
| 三个新场景页（中英） | 有 | WebPage、Service、FAQPage、BreadcrumbList（`/solutions/` 下的页面自动生成），不缺 |
| `/solutions/`、`/homes/` | 有 | CollectionPage 下**没有列出子页** |

### 补上的部分（`src/components/Seo.tsx`，没有重写）

- `/solutions/`、`/homes/`：新增一个 `ItemList` 节点（`#list`），列出该栏目下的全部子页（名称和地址），并设为 CollectionPage 的 `mainEntity`。
- `/compare/`：新增一个 `ItemList` 节点，列出它比较的五条业务线（名称、适合谁、页面地址）。
  - 预购设备不放进去，和 `/products/` 一样不用 Product / Offer 标记，原因见 `Seo.tsx` 里的注释。

### 本地检查结果

- `npm run lint`、`npm run typecheck`、`npm run build` 都通过，预渲染页数从 122 增加到 128。
- 128 个页面的标题都不超过 65 宽（中文按 2 计），描述都不超过 160 字符，没有一页超出。
- 三个新页面的标题宽度：英文 58 / 64 / 64，中文 41 / 59 / 61。
- 新页面的站内链接逐条比对 `dist/`，没有死链。
- `/solutions/` 的 ItemList 有 10 项，`/zh/homes/` 有 5 项，`/compare/` 有 5 项；JSON-LD 的 `@graph` 里没有 null 节点。

## 3. 线上核对

部署于提交 `28c1e8e`，GitHub Actions Deploy 运行 44986102873，结果 success。

- **返回状态**：下面 16 个地址都返回 200。
  - `/faq/`、`/compare/`、`/contact/`
  - `/solutions/`、`/homes/`
  - 三个新场景页
  - 以上每个地址的 `/zh/` 版本
- **sitemap**：`sitemap.xml` 返回 200，上面这 12 个地址都在里面：FAQ、对比、询价和三个场景页，中英各一份。
- **标题与描述**：从线上 HTML 读取，与本地构建一致，都在长度限制内。
- **结构化数据**（从线上 HTML 读取）：
  - `/compare/`（中英）：WebPage + ItemList（5 项）+ BreadcrumbList。
  - `/solutions/`（中英）：CollectionPage + ItemList（10 项，含三个场景页）。
  - `/homes/`（中英）：CollectionPage + ItemList（5 项）。
  - 三个场景页（中英）：WebPage + Service + FAQPage + BreadcrumbList。
  - `/faq/`：FAQPage；`/contact/`：ContactPage。这两页和上一轮一样，没有改动。
