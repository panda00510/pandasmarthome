import type { Content } from './types'

export const zh: Content = {
  htmlLang: 'zh-Hans-SG',

  meta: {
    title: 'Panda智能家居｜新加坡开放式智能家居解决方案',
    description:
      'Panda智能家居为新加坡的组屋、预购组屋、公寓与有地住宅设计并安装开放式、本地优先的智能家居系统，基于Home Assistant构建，不绑定单一品牌。',
    keywords:
      '新加坡智能家居, Home Assistant 新加坡, 组屋智能家居, BTO 智能家居, 公寓智能家居, 智能灯光, 空调智能控制, 电动窗帘, Matter, Zigbee',
    ogImageAlt: 'Panda智能家居 — 新加坡开放式智能家居解决方案',
  },

  a11y: {
    skipToContent: '跳到主要内容',
    openMenu: '打开导航菜单',
    closeMenu: '关闭导航菜单',
    homeLink: 'Panda智能家居 — 返回顶部',
    languageSwitcher: '切换语言',
  },

  nav: {
    items: [
      { id: 'why', label: '为何开放' },
      { id: 'solutions', label: '解决方案' },
      { id: 'platform', label: '技术平台' },
      { id: 'homes', label: '住宅类型' },
      { id: 'process', label: '服务流程' },
      { id: 'faq', label: '常见问题' },
    ],
    cta: '规划我的系统',
  },

  hero: {
    eyebrow: '开放式智能家居 · 新加坡',
    titleLead: '真正听你的家，',
    titleAccent: '而不是听云端的。',
    lead: '不同品牌的灯光、空调、窗帘、门锁与摄像头，在一套完全属于你的本地系统上协同运作。',
    primaryCta: '规划我的系统',
    secondaryCta: '查看安装内容',
    trust: [
      '本地运行，断网照常工作',
      '自由混搭品牌，不被绑定',
      '开灯不需要月费订阅',
      '完整文档，系统交到你手上',
    ],
    imageAlt: '采光良好的现代公寓客厅，配有大面积落地窗与当代家具',
    panel: {
      title: '我的家',
      subtitle: '系统运行正常',
      rooms: ['客厅', '主卧', '厨房', '书房'],
      scenes: [
        { name: '早安模式', detail: '窗帘开启 · 空调关闭' },
        { name: '观影模式', detail: '灯光 15% · 窗帘落下' },
        { name: '离家模式', detail: '门锁布防 · 摄像头开启' },
      ],
      status: '本地控制 · 42 台设备在线',
    },
  },

  value: {
    eyebrow: '为何开放',
    title: '多数智能家居，都断在品牌与品牌之间。',
    lead: '每个厂商都想要自己的App、自己的账号、自己的网关。开放式系统去掉这些接缝。',
    items: [
      {
        id: 'local',
        title: '本地优先，隐私默认',
        body: '自动化运行在你家中的硬件上。断网时开关与传感器照常响应。',
      },
      {
        id: 'brands',
        title: '一套系统，多个品牌',
        body: '按需要挑设备，而不是迁就手上的网关。一个界面，而不是六个App。',
      },
      {
        id: 'nolockin',
        title: '不绑定，不设付费墙',
        body: '底层平台开源，由非营利基金会维护。你和自家开关之间没有订阅。',
      },
      {
        id: 'handover',
        title: '为交付而建',
        body: '你会拿到管理员账号、书面设备清单与完整讲解。没有隐藏的门槛。',
      },
    ],
  },

  solutions: {
    eyebrow: '解决方案',
    title: '我们设计与安装的内容',
    lead: '每个家的组合都不一样。以下是我们最常处理的几个方向。',
    items: [
      {
        id: 'lighting',
        title: '灯光与场景',
        body: '夜里暖而柔和，打扫时明亮，半夜不用再翻找是哪个App。',
        bullets: [
          '按回路选择智能开关、调光器或灯泡',
          '支持老式组屋的无零线方案',
          '物理开关始终保持可用',
        ],
      },
      {
        id: 'climate',
        title: '空调与舒适度',
        body: '在新加坡，舒适基本等于空调与湿度问题。分体机与风扇按真实室内状况反应。',
        bullets: [
          '常见分体空调的红外或原厂模块控制',
          '以温湿度传感器为依据，不靠感觉',
          '开窗或无人时自动关闭',
        ],
      },
      {
        id: 'shades',
        title: '窗帘与百叶',
        body: '清晨采光、午后西晒与隐私，不需要任何人去找遥控器。',
        bullets: [
          '电动窗帘轨道、卷帘与拉链帘',
          '按日出、日落与西晒时段调节',
          '支持半开位置，控制眩光',
        ],
      },
      {
        id: 'security',
        title: '门锁与安防',
        body: '门锁、门磁与摄像头汇总到一个面板，支持的情况下采用本地录像。',
        bullets: [
          '门锁与铁闸状态集中查看',
          '门窗与人体传感器，只推有用的提醒',
          '离家、在家与夜间模式',
        ],
      },
      {
        id: 'control',
        title: '控制方式',
        body: '系统好不好用取决于人怎么触达它，包括从没装过App的客人与家佣。',
        bullets: [
          '定制手机与平板控制面板',
          '壁挂平板或场景面板',
          '为只想按一下按钮的家人保留简易模式',
        ],
      },
      {
        id: 'energy',
        title: '能耗与监测',
        body: '看清电用在哪里。对空调用量大、装了太阳能或充电桩的住户尤其实用。',
        bullets: [
          '全屋或分回路能耗监测',
          '空调运行时长与耗电明细',
          '漏水、烟雾与燃气传感器',
        ],
      },
    ],
  },

  platform: {
    eyebrow: '技术平台',
    title: '基于 Home Assistant 构建',
    lead: '一套以本地控制与隐私优先的开源家庭自动化平台，由非营利的 Open Home Foundation 管理。支撑你家运行的软件，不会被出售或搬到付费墙后面。',
    points: [
      {
        title: '极广的设备覆盖',
        body: '超过 1,500 个集成，涵盖主流品牌、空调系统、逆变器、路由器与摄像头。',
      },
      {
        title: '真正读得懂场景的自动化',
        body: '规则可同时结合时间、日照、有人无人、温度与门窗状态，而不只是定时。',
      },
      {
        title: '运行在你家的硬件上',
        body: '我们负责选型并安装控制主机，尽可能使用有线网络。',
      },
      {
        title: '远程访问由你决定',
        body: '可选项，需单独配置。日常运作完全不依赖远程服务器。',
      },
    ],
    protocolsTitle: '我们支持的协议',
    hubLabel: '你的家',
    protocols: [
      { label: 'Matter', note: '跨品牌标准，设计上即为本地通信' },
      { label: 'Thread', note: '适合电池设备的低功耗网状网络' },
      { label: 'Zigbee', note: '成熟的灯光与传感器网络' },
      { label: 'Z-Wave', note: '独立频段，门锁类表现稳定' },
      { label: 'Wi-Fi / 局域网', note: '厂商开放本地接口时优先使用' },
      { label: '蓝牙 LE', note: '人员感知、追踪器与小型传感器' },
      { label: 'ESPHome', note: '定制传感器与控制器' },
      { label: 'MQTT / Modbus', note: '逆变器、电表与工业设备' },
    ],
    sourceNote:
      '集成数量与平台信息引自 home-assistant.io 官方说明。Panda智能家居为独立安装服务商，与 Home Assistant 项目及 Open Home Foundation 无隶属关系。',
  },

  homes: {
    eyebrow: '住宅类型',
    title: '不同的房子，不同的限制条件',
    lead: '转售组屋、还没拿钥匙的预购组屋、有管理层的公寓，各自需要不同的方案。',
    items: [
      {
        id: 'bto',
        title: '预购组屋与新交房',
        subtitle: '时机最好的阶段',
        body: '装修之前是把这件事做对成本最低的时刻。开关位置、零线与网络点位在电路图阶段几乎不增加费用，事后补做就要敲墙。',
        bullets: [
          '智能化预留的电路与网络布局评估',
          '按需增加零线与加深底盒',
          '与室内设计师和电工协同推进',
        ],
        imageAlt: '新加坡榜鹅的组屋，屋顶装有太阳能板',
      },
      {
        id: 'hdb',
        title: '转售组屋与现有住宅',
        subtitle: '三房式到公寓式',
        body: '现有单位无需大动土木也能升级。我们先勘查线路实际条件，再挑选匹配的设备。',
        bullets: [
          '下单前先完成线路勘查',
          '提供无零线与免改造的设备选项',
          '可分阶段实施，先做一个区域再扩展',
        ],
        imageAlt: '新加坡 Segar 轻轨站附近、临水道的组屋建筑群',
      },
      {
        id: 'condo',
        title: '公寓',
        subtitle: '在管理层规定内实施',
        body: '装修时段限制、外立面不得改动，以及必须与楼宇既有系统共存而非取代的部分。',
        bullets: [
          '遵守管理层装修规定的方案',
          '与楼宇对讲及门禁系统共存',
          '限制打孔的场合优先采用无线方案',
        ],
        imageAlt: '从下方仰视新加坡滨海湾的高层住宅楼',
      },
      {
        id: 'landed',
        title: '有地住宅与大户型',
        subtitle: '多层、多代同堂',
        body: '大房子在需要聪明的自动化之前，先需要认真的网络设计：跨楼层覆盖、需要照看的周界，以及期待完全不同的几代人。',
        bullets: [
          '结构化布线与Mesh覆盖规划',
          '大门、周界与多摄像头整合',
          '在App之外保留简单的实体控制',
        ],
        imageAlt: '新加坡安静住宅街道旁的有地住宅',
      },
    ],
    note: '具体范围与报价在现场评估后提供。我们不公布需要一堆假设才成立的套餐价格。',
  },

  process: {
    eyebrow: '服务流程',
    title: '从第一次沟通到正式交付',
    lead: '流程清晰可预期，任何设备下单之前都会有书面方案。',
    steps: [
      {
        title: '需求沟通',
        body: '家里真实的生活方式、目前最困扰的问题，以及已经买了哪些设备。',
      },
      {
        title: '勘查与系统设计',
        body: '上门勘查或审阅平面图，输出书面设备清单、网络方案与工作范围。',
      },
      {
        title: '多方协调',
        body: '在封墙之前，与室内设计师、装修承包商与电工配合到位。',
      },
      {
        title: '安装与配置',
        body: '完成设备安装、主机部署、面板搭建，并调校自动化。',
      },
      {
        title: '交付与支持',
        body: '实机讲解、书面文档、管理员账号，以及后续支持安排。',
      },
    ],
    note: '所有电气作业均由符合新加坡相关规定的持证人员执行。',
  },

  compatibility: {
    eyebrow: '设备兼容',
    title: '我们常见的整合品牌与系统',
    lead: '以下是我们在新加坡住宅中常遇到的品牌示例，并非销售目录。有些产品支持本地接入，有些只能通过云端接口——我们会在写进方案前确认具体型号。',
    groups: [
      {
        title: '灯光与开关',
        brands: [
          'Philips Hue',
          'IKEA',
          'Aqara',
          'Sonoff',
          'Shelly',
          'Yeelight',
          '基于 Tuya 的品牌',
          'Zigbee 与 Matter 开关',
        ],
      },
      {
        title: '空调与风扇',
        brands: [
          'Daikin',
          'Mitsubishi Electric',
          'Panasonic',
          'LG',
          'Samsung',
          'Midea',
          '红外控制分体机',
          'DC 吊扇',
        ],
      },
      {
        title: '窗帘、百叶与电机',
        brands: [
          'Aqara',
          'SwitchBot',
          'Zemismart',
          'Somfy',
          'Dooya',
          'Tuya 电机控制器',
        ],
      },
      {
        title: '门锁、门禁与传感器',
        brands: [
          'igloohome',
          'Yale',
          'Samsung 智能门锁',
          'Kaadas',
          'Aqara 传感器',
          'SwitchBot',
          'Zigbee 与 Z-Wave 门磁',
        ],
      },
      {
        title: '摄像头与录像',
        brands: [
          'Reolink',
          'Hikvision',
          'Dahua',
          'Ubiquiti',
          'ONVIF / RTSP 摄像头',
          'Frigate 本地录像',
        ],
      },
      {
        title: '语音、影音与生态',
        brands: [
          'Apple Home',
          'Google Home',
          'Amazon Alexa',
          'Sonos',
          'Chromecast',
          '本地语音助手',
        ],
      },
    ],
    disclaimer:
      'Panda智能家居通过Home Assistant及其支持的连接方式集成兼容的第三方产品。相关产品名称及商标归各自所有，设备兼容不代表与相关品牌存在官方合作或认可关系。',
    haCaption: 'Home Assistant —— 我们所有系统所基于的开源平台。',
  },

  faq: {
    eyebrow: '常见问题',
    title: '开始之前值得问清楚的问题',
    lead: '大家真正关心的问题，不加修饰地回答。',
    items: [
      {
        q: '断网之后会怎样？',
        a: '核心功能照常运作。自动化、墙面开关、传感器与本地面板都跑在你家中的主机上。只有远程访问和仅支持云端的设备会暂停，网络恢复即可继续。',
      },
      {
        q: '一定要重新布线或敲墙吗？',
        a: '通常不需要。免布线开关模块、无零线开关与电池传感器都能在现有线路上工作。装修时纳入设计更便宜整洁，但不是前提条件。',
      },
      {
        q: '已经买的设备还能用吗？',
        a: '大多数可以，沟通时把清单带上。常见品牌多数可直接接入，少部分只能走云端账号。在你再花钱之前，我们会先说清楚哪些属于哪一类。',
      },
      {
        q: '有月费吗？',
        a: '系统本身没有。Home Assistant 开源，运行在你家的硬件上。可选项目——你自己保留的云服务、或与我们签的支持服务——都会单独列明。',
      },
      {
        q: '家里不用App的长辈怎么办？',
        a: '物理开关的用法完全不变。我们还会加装墙面场景面板、按键或简单的壁挂平板，任何人都不需要手机就能开灯。',
      },
      {
        q: '隐私性到底如何？',
        a: '自动化逻辑与历史数据都留在你的硬件上，比一堆厂商App好得多。但并非绝对：任何需要连回厂商服务器的设备仍然会这样做。我们会标明哪些会联网，并在有替代方案时提供纯本地选项。',
      },
      {
        q: '以后我可以自己接手吗？',
        a: '可以，我们就是按这个前提做的。你会拿到管理员账号与完整文档，不存在只有我们能维护的私有层。',
      },
      {
        q: '安装需要多久？',
        a: '单一区域改造通常一到两天。全屋系统会跟着装修周期分阶段推进。书面方案中会附上大致时间表。',
      },
    ],
  },

  contact: {
    eyebrow: '联系我们',
    title: '说说你的房子',
    lead: '告诉我们住宅类型，以及最想先解决的问题。我们会如实反馈哪些值得做、按什么顺序做。',
    detailsTitle: '联系方式',
    pendingDetails: '联系方式待确认',
    pendingDetailsNote: '电话、邮箱与WhatsApp尚未公布。配置完成后会显示在此处及上方按钮中。',
    labels: {
      email: '电子邮箱',
      phone: '电话',
      whatsapp: 'WhatsApp',
      address: '办公地址',
      serviceArea: '服务范围',
    },
    form: {
      title: '咨询表单',
      name: '称呼',
      namePlaceholder: '我们该怎么称呼你？',
      contact: '邮箱或电话',
      contactPlaceholder: 'you@example.com 或 +65 …',
      contactHelp: '仅用于回复本次咨询。',
      homeType: '住宅类型',
      homeTypeOptions: [
        '请选择…',
        '预购组屋 / 新交房',
        '转售组屋或现有单位',
        '公寓',
        '有地住宅',
        '其他 / 尚未确定',
      ],
      message: '你最想解决什么？',
      messagePlaceholder: '例如：两间卧室的空调、客厅窗帘，以及用一个App管全部。',
      submit: '发送咨询',
      submitViaEmail: '用邮件发送',
      submitting: '发送中…',
      consent: '发送即表示同意我们使用以上信息回复你的咨询。',
      viaEmailNote: '点击后会打开你的邮件应用并自动填好内容，在邮件应用中点击发送即可送达我们。',
    },
    states: {
      unconfiguredTitle: '表单接口尚未配置',
      unconfiguredBody:
        '本次部署未设置表单接口，也未设置联系邮箱，因此表单无法提交，也不会伪装成提交成功。请在环境变量中设置 VITE_FORM_ENDPOINT 或 VITE_CONTACT_EMAIL 以启用。',
      successTitle: '咨询已发送',
      successBody: '谢谢，我们已收到你的留言，会尽快与你联系。',
      mailtoTitle: '你的邮件应用应该已经打开',
      mailtoBody: '咨询内容已为你填好。需要在邮件应用中点击发送，我们才会收到。',
      mailtoFallback: '没有自动打开？请直接发邮件至',
      errorTitle: '发送失败',
      errorBody: '发送过程中出现问题。请重试，或通过页面上列出的其他方式联系我们。',
      required: '此项为必填。',
      invalidContact: '请填写有效的邮箱地址或电话号码。',
    },
    whatsappCta: '通过WhatsApp联系',
    emailCta: '发送邮件',
    mailSubject: '智能家居咨询',
  },

  cta: {
    title: '从一次对话开始，而不是从一张购物清单开始。',
    lead: '好的系统都始于了解一个家真实的生活方式。',
    primary: '规划我的系统',
    secondary: '查看常见问题',
  },

  footer: {
    blurb:
      '面向新加坡住宅的开放式、本地优先智能家居设计与安装服务，基于 Home Assistant 构建。',
    navTitle: '浏览',
    legalTitle: '法律信息',
    contactTitle: '联系',
    credits: '图片来源与许可',
    creditsHref: 'asset-sources.txt',
    rights: '保留所有权利。',
    builtWith: '基于 Home Assistant 构建，独立安装服务商。',
    disclaimer:
      'Panda智能家居通过Home Assistant及其支持的连接方式集成兼容的第三方产品。相关产品名称及商标归各自所有，设备兼容不代表与相关品牌存在官方合作或认可关系。',
  },
}
