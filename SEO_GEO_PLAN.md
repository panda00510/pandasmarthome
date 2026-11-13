# SEO + GEO 计划（smartpanda.sg）

> 正式域名：**https://smartpanda.sg/**（canonical）。`www.smartpanda.sg`、`pandasmarthome.xunleix8.workers.dev` 301 到它；GitHub Pages 副本的 canonical 也指向它。
> GEO = 面向 ChatGPT / Perplexity / Google AI Overviews / Copilot 等生成式引擎的优化。
> 本文最后更新：2026-11-13。

## 1. 现状审计结论（基于 `npm run build` 的 dist/ 实际产物）

整体底子好：全部页面预渲染（不跑 JS 的爬虫也能看到全文和 JSON-LD）、中英双语分路径、canonical/hreflang 成对互指、sitemap lastmod 来自 git 和 guide `updated`、robots.txt 放行 AI 爬虫、已有 llms.txt 和 RSS。

| 项 | 结论 | 处理 |
| --- | --- | --- |
| title 唯一性 | 无重复 | — |
| title 长度 | 英文 guide 有 16 篇超过 70 字符（最长 122），品牌后缀把关键词挤出截断区 | 已修：超长时去掉品牌后缀（见 §2）；仍偏长的列在 §4 待改 |
| description | 无重复；5 条英文 >160 字符 | 3 条 guide 已缩短；首页、/products/ 在 en.ts，留给内容同事 |
| canonical / hreflang | 每页自指 canonical，en / zh-Hans / x-default 互指 | — |
| sitemap | 有 en、zh-Hans alternates，缺 x-default；showroom 已在 | 已补 x-default |
| lastmod | 真实（git 提交日期 / guide `updated`） | — |
| robots.txt | 放行 GPTBot、ClaudeBot、PerplexityBot 等 | 补 Claude-User、Perplexity-User、Applebot、DuckAssistBot |
| llms.txt | 有服务、产品、guide 列表，但缺"品牌是谁 / 在哪 / 核心页面一句话"，无 showroom | 已重构（§2）；新增 llms-full.txt |
| JSON-LD | 有 LocalBusiness、FAQPage、WebSite、Article、BreadcrumbList、Service；但节点大多无 `@id`、互不引用；索引页（/homes/、/solutions/、/guides/、/products/、/software/）无页面节点和面包屑；专题页面包屑漏了 hub 一层 | 已修（§2） |
| SearchAction | 站内没有搜索功能，加了就是虚假声明 | **不加** |
| og:image | 绝对 URL ✓；中文页 `og:image:alt` 仍是英文 | 已修 |
| h1 | /homes/、/solutions/（中英 4 页）**没有 h1**；/guides/ 从 h1 直接跳 h3（卡片标题） | 组件在 `sections/`，不在本次改动范围，见 §4 |
| 孤儿页 | 无（每页都有站内入链） | — |
| 图片 alt | 预渲染 HTML 里所有 `<img>` 都有 alt | — |
| 答案式摘要 | guide 顶部显示 description；但 14 篇 guide 没有 `points:`（"简短版"三要点） | 已补齐 |
| 作者 / 更新日期 | guide 页可见"更新于"日期；**无可见作者**；专题页（/homes/…、/solutions/…）不显示日期 | 见 §4（组件改动） |
| 安全/信任响应头 | 线上无 HSTS、X-Content-Type-Options、Referrer-Policy、Permissions-Policy | 已在 worker 里加（§2） |

## 2. 已实施项

**代码**

- `src/content/guides.ts`
  - `pageMeta`：标题加品牌后缀后，宽度超过约 65（CJK 记 2）就不加后缀。品牌仍在 `og:site_name` 和 JSON-LD 里。
  - 5 个新 guide 加进 TOPICS 筛选分类。
- `src/components/Seo.tsx`（追加式改动）
  - 商家节点：类型改为 `Organization + LocalBusiness + HomeAndConstructionBusiness`；logo 用 512×512 方形图标；加 `knowsAbout`；配了 `VITE_COMPANY_REGISTRATION_NO` 才输出 UEN `identifier`。
  - 每页节点都有 `@id`（`#webpage` / `#article` / `#faq` / `#breadcrumb` / `#service`），并用 `isPartOf → #website`、`breadcrumb`、`about → #business`、`author/publisher → #business` 互相引用。
  - 专题页面包屑补上 hub 一层（首页 › 你的家 › BTO）。
  - 索引页（hub、/guides/、/products/、/software/）加 `CollectionPage`/`WebPage` 节点和面包屑。
- `src/entry-server.tsx` + `scripts/prerender.mjs`
  - guide 页加 `article:published_time` / `article:modified_time`。
  - 中文页 `og:image:alt` 改为中文。
  - sitemap 补 `x-default`。
  - robots 补充爬虫名单。
  - llms.txt 重构：开头加 About（是谁、服务区域、语言、做法、价格口径、联系入口），以及 Core pages（每页一句话，带中文链接）；showroom 用一句话介绍为"可交互 3D HDB 样板间演示"。Core pages 由 `pagePaths` 自动生成，所以视觉同事把 `/custom-hardware/` 加进 `pagePaths` 后，它会自动出现。
  - 新增 `llms-full.txt`：全部 guide 和专题页的全文，中英都有，链接已转成绝对地址。
- `worker/index.js`：所有资源响应加 `Strict-Transport-Security: max-age=31536000`、`X-Content-Type-Options: nosniff`、`Referrer-Policy: strict-origin-when-cross-origin`、`Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`。
  - 放在 worker 而不是 `public/_headers`：开了 `run_worker_first` 后，响应由 Worker 返回，Cloudflare 文档不保证 `_headers` 对 Worker 响应生效，放在代码里是确定的。
  - `worker/index.test.mjs` 已加断言。
- README：Deployment 节的 canonical 改为 smartpanda.sg，Web3Forms Allowed Domains 加上 smartpanda.sg / www；SEO 节同步。

**内容**（`src/content/guides/`，中英各一份，含 FAQ 和内链）

1. `bto-key-collection-smart-home-timeline`：BTO 拿钥匙后智能家居的先后顺序
2. `smart-home-during-hdb-renovation`：HDB 装修期间智能家居谁做什么
3. `condo-smart-home-upgrade-cost-factors`：Condo 智能家居升级费用由什么构成（不报价）
4. `singapore-humidity-mould-aircon-dry-mode-automation`：新加坡全年潮湿：湿度传感器、除湿与冷气 Dry 模式自动化
5. `esp32-ai-voice-assistant-what-it-can-do`：ESP32-S3 AI 语音助手能做什么、不能做什么（配合 ESP32 硬件定制业务线）

另外：14 篇旧 guide 补了 `points:`（三条要点，从正文提炼，不加新事实），3 条英文 description 缩到 160 字符以内，`updated` 都改成了 2026-11-13。

Matter 选题已有 `what-is-matter`，没有重复写。

## 3. 需要老板提供的真实信任素材（**不能编造，没有就空着**）

没有这些，Google 本地包（Local Pack）和 AI 引擎的"可信商家"引用基本拿不到。站点代码已经预留，只从 env 读取，配上即可生效：

| 素材 | 去处 |
| --- | --- |
| UEN（公司注册号） | `VITE_COMPANY_REGISTRATION_NO` → JSON-LD `identifier`；建议也写进页脚 |
| 办公 / 服务地址（或明确的"上门服务、无门店"） | `VITE_OFFICE_ADDRESS_*` → JSON-LD `address`；与 GBP 完全一致 |
| 品牌邮箱 `hello@smartpanda.sg` | `VITE_CONTACT_EMAIL`（配好 MX 和转发后再换） |
| 电话 | `VITE_CONTACT_PHONE` |
| 真实项目照片（现在用的是标注 illustrative 的图库图） | 替换 `src/assets` 照片，并更新 ASSET_SOURCES.md |
| 客户评价（真实、可核实、经客户同意） | 先放 GBP；站内加 Review 结构化数据要等真实评价足够多 |
| Google Business Profile | 见 §4 |
| 社交账号（Instagram / 小红书 / Facebook / LinkedIn） | `VITE_SOCIAL_*` → JSON-LD `sameAs` |

## 4. 站长需要手动做的事

**搜索引擎**

1. Google Search Console：添加 **域名资源** `smartpanda.sg`（DNS TXT 验证），提交 `https://smartpanda.sg/sitemap.xml`。旧的 workers.dev 资源保留，用"地址更改"工具指向新域名。
2. Bing Webmaster Tools：从 GSC 导入，提交同一个 sitemap（Copilot / ChatGPT 搜索都依赖 Bing 索引）。IndexNow 已经自动 ping。
3. 用 Rich Results Test 抽查首页、一篇 guide、一个专题页。
4. HSTS 上线稳定一个月后，再考虑加 `includeSubDomains; preload` 并提交 hstspreload.org（不可轻易撤回，需老板确认）。
5. 后续加 CSP：内联 JSON-LD 需要 hash 或 nonce，showroom 要单独测，所以这次没上。

**Google Business Profile（本地包的关键）**

- 类别：Smart home installation / Home automation company（以 GBP 实际可选项为准）。
- 选"服务区域商家"，区域填 Singapore；没有门店就隐藏地址。
- NAP（名称、地址、电话）与网站和 JSON-LD **逐字一致**。
- 上传真实项目照片，每月发 1–2 条动态，邀请真实客户留评并逐条回复。

**反向链接 / 本地目录清单**（只做真实收录，不买链接）

- [ ] Google Business Profile、Bing Places、Apple Business Connect
- [ ] 新加坡本地目录：Yellow Pages SG、Streetdirectory 商家目录、SGPBusiness（基于 UEN 自动收录，核对信息即可）
- [ ] 装修 / 家居平台：Qanvast、Renopedia、Hometrust 等（按平台规则开商家页）
- [ ] 社区：HardwareZone 论坛 Home & Living 版、Reddit r/singapore / r/homeassistant（以真实回答问题为主，签名带站点）
- [ ] 小红书 / Facebook 群组（BTO 各期业主群）：发 guide 摘要并附原文链接
- [ ] GitHub：ESP32 固件 / ESPHome 配置的开源仓库 README 链回 /custom-hardware/
- [ ] 合作方：ID、电工、窗帘商互相在"合作伙伴"页链接（需真实合作关系）

**仍待改的站内项（需组件改动，不在本次范围）**

- `/homes/`、`/solutions/` 没有 h1：`HubPage` 里的 `SectionHeading` 需要一个 `as="h1"` 选项。
- `/guides/` 从 h1 跳到 h3：`GuideCard` 标题改为 h2，或者在卡片前加一个 h2 分区标题。
- guide 页显示可见作者（例如"Panda Smart Home 团队"，链接到 /how-it-works/）；专题页也显示"更新于"日期。
- 仍偏长的英文 title 建议改写到 60 字符以内，同时把可见长标题移到 `heading:`：reduce-aircon-electricity-smart-home、smart-home-privacy-local-vs-cloud、local-smart-home-vs-google-apple-smartthings、water-smoke-humidity-sensors-singapore、radar-fall-detection 等。
- `en.ts` 里首页、/products/、/custom-hardware/ 的 meta description 超过 160 字符（178 / 212 / 198）。
- 首页可以加一段 2–3 句的"我们是谁、在哪、做什么"答案式段落（便于 AI 直接引用）。

## 5. 关键词（四条业务线）

| 业务线 | 英文 | 中文 |
| --- | --- | --- |
| 全屋智能家居安装 | smart home Singapore、smart home installation Singapore、BTO smart home、HDB renovation smart home、condo smart home upgrade、no neutral smart switch、smart aircon control Singapore、motorised curtains Singapore | 新加坡智能家居、组屋智能家居、BTO 装修 智能家居、公寓 智能家居 |
| ESP32 AI 硬件定制 | ESP32 custom hardware Singapore、custom AI voice assistant device、ESP32-S3 voice assistant、Home Assistant touch panel custom、ESPHome custom device Singapore | 小智 AI 定制、ESP32 定制开发 新加坡、AI 语音助手 硬件定制 |
| 小企业软件定制 | custom software small business Singapore、booking system Singapore SME、WhatsApp bot Singapore | 新加坡 小企业 软件定制、预约系统 定制 |
| Panda Signage 信息屏系统（`/signage/`） | digital signage Singapore、meeting room display、room booking panel、digital signage software self-hosted | 信息屏系统 新加坡、会议室门牌、会议预约屏、信息发布系统 |

## 6. 内容日历（3 个月，每两周 1 篇，中英同发）

| 周 | 选题 | 业务线 |
| --- | --- | --- |
| 2026-11 第 4 周 | Home Assistant 触控面板：现成产品和定制 ESP32 面板怎么选 | 硬件定制 |
| 2026-12 第 2 周 | 组屋主门智能锁：HDB 防火门的注意事项（需先核实官方规定） | 安装 |
| 2026-12 第 4 周 | 有地住宅的网络和多层覆盖规划 | 安装 |
| 2027-01 第 2 周 | ESP32 定制设备从需求到交付：要准备什么、怎么验收 | 硬件定制 |
| 2027-01 第 4 周 | 小店用 WhatsApp 自动回复 / 预约：什么时候值得定制 | 软件定制 |
| 2027-02 第 2 周 | 太阳能 / EV 充电桩家庭的能耗监测 | 安装 |

每篇的要求：开头 2–3 句直接回答；`points:` 三要点；`## Common questions` 3–4 问；3 个以上内链；不写编造的数字和规定。已有文章每季度复核一次，有实质修改再改 `updated`。

## 7. 监测指标（每月看一次）

- GSC：已编入索引的页数（目标：sitemap 里的 URL 全部编入）、展示量、点击、平均排名。按"BTO / HDB / condo / ESP32"分组看查询词。
- Bing WMT：索引数和点击（反映 Copilot / ChatGPT 搜索的可见度）。
- AI 引用：每月用固定的 10 个问题，在 ChatGPT 搜索、Perplexity、Google AI Overviews 里各问一次（例如"BTO 拿钥匙后智能家居先做什么""ESP32 voice assistant Singapore"），记录有没有引用 smartpanda.sg。
- 服务器日志 / Cloudflare Analytics：GPTBot、ClaudeBot、PerplexityBot、OAI-SearchBot 的抓取次数，以及 llms.txt 和 llms-full.txt 的请求量。
- 转化：联系表单提交数和 WhatsApp 点击数（按落地页区分）。
- GBP：搜索 / 地图展示量、来电、路线、网站点击、评价数。
