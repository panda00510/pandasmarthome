import type { Glossary } from './types'

/**
 * /zh/glossary/ 词条（中文）。每条只复述指南里已有的说法，链接指向详细讲解的页面。
 * 只在术语表页加载（src/views.ts）。id 与 glossary.en.ts 保持一致。
 */
const g = (slug: string) => `guides/${slug}/`

export const glossary: Glossary = {
  groups: [
    {
      id: 'protocols',
      title: '协议与标准',
      terms: [
        {
          id: 'matter',
          term: 'Matter',
          body: '一个开放标准，规定智能家居设备之间、设备与控制它们的 App 和网关之间怎么“说话”。Matter 设备可以加入任何兼容 Matter 的平台，不再只能用品牌自家的 App。它规定的是语言而不是无线方式：Matter 可以跑在 Wi-Fi、Thread 或有线网络上。',
          links: [g('what-is-matter'), g('local-smart-home-vs-google-apple-smartthings')],
        },
        {
          id: 'thread',
          term: 'Thread',
          body: '一种低功耗的网状网络，适合电池传感器、门锁和窗帘，也是 Matter 可以使用的连接方式之一。Thread 设备需要家里网络上有一台 Thread 边界路由器；部分智能音箱、电视盒子和网关内置了这个功能，买之前先确认。',
          links: [g('what-is-matter')],
        },
        {
          id: 'zigbee',
          term: 'Zigbee',
          body: '很多传感器、开关和窗帘电机使用的低功耗无线网状网络。Zigbee 设备连接网关而不是 Wi-Fi，只有网关需要联网；接市电的设备还能帮忙增强网状网络。改用 Matter 时，正常工作的 Zigbee 设备不必换掉。',
          links: [g('wifi-for-smart-home'), g('what-is-matter')],
        },
        {
          id: 'wifi',
          term: 'Wi-Fi',
          body: '手机和电脑已经在用的家庭网络，很多插座、灯泡和摄像头直接连它。不少智能设备只支持 2.4 GHz，几十个设备对路由器的要求也比几部手机高得多，所以覆盖值得提前规划。',
          links: [g('wifi-for-smart-home')],
        },
        {
          id: 'bluetooth-le',
          term: '低功耗蓝牙（Bluetooth LE）',
          body: '手机和很多小设备（包括 ESP32 芯片）内置的短距离、低功耗无线方式。有些智能门锁用它通过手机 App 开锁，方便，但要看手机电量和 App 是否正常。',
          links: [g('smart-door-lock-guide'), g('esp32-ai-voice-assistant-what-it-can-do')],
        },
        {
          id: 'infrared',
          term: '红外（IR）',
          body: '电视或空调遥控器发出的不可见信号。智能红外控制器能学习或内置这些信号，放在“看得到”室内机的位置，就能按 App、定时或自动化发出指令，不用改线。',
          links: [g('smart-aircon-control'), g('smart-home-for-renters')],
        },
        {
          id: 'mqtt',
          term: 'MQTT',
          body: '一种轻量的消息协议：设备通过你自己网络上的消息服务器上报数据、接收指令。它和 Home Assistant、ESPHome、Matter 一样，是定制设备接入你现有系统、中间不经过厂商云端的方式之一。',
          links: [g('custom-esp32-device-or-off-the-shelf'), 'custom-hardware/'],
        },
      ],
    },
    {
      id: 'system',
      title: '系统与控制',
      terms: [
        {
          id: 'local-control',
          term: '本地控制',
          body: '由你家网络里的网关或控制器做决定，而不是厂商的服务器。断网时，墙面开关、场景按键、自动化和传感器照常工作，离开家里的数据也更少。如果设备厂商不提供本地控制，任何平台都没法替它加上。',
          links: [g('smart-home-without-internet'), g('local-smart-home-vs-google-apple-smartthings')],
        },
        {
          id: 'cloud',
          term: '云端',
          body: '厂商放在互联网上的服务器。以云端为主的平台和 App 通常上手更简单，但断网时远程访问、大多数语音助手和只能走云端的设备都会停摆，服务条款和价格也可能变。',
          links: [g('smart-home-privacy-local-vs-cloud'), g('local-smart-home-vs-google-apple-smartthings')],
        },
        {
          id: 'hub',
          term: '网关 / 中控',
          body: '放在家里网络上的小盒子，Zigbee 或 Thread 传感器之类的设备连接它，只有网关本身需要联网。有了本地网关或控制器，自动化不靠互联网也能运行。它放的位置要预留电源插座和网线。',
          links: [g('wifi-for-smart-home'), g('bto-key-collection-smart-home-timeline')],
        },
        {
          id: 'home-assistant',
          term: 'Home Assistant',
          body: '一个使用广泛的开源智能家居平台，运行在你家里的硬件上。它能把很多品牌的设备接到一处，自动化和控制面板在本地网络上就能用，但比云端 App 需要更多设置和维护。',
          links: [g('local-smart-home-vs-google-apple-smartthings'), g('custom-esp32-device-or-off-the-shelf')],
        },
        {
          id: 'esphome',
          term: 'ESPHome',
          body: '给 ESP32 等芯片用的开源固件，用配置文件设置，能让设备不经厂商云端直接接入 Home Assistant。我们的桌面触摸面板运行的就是 ESPHome。',
          links: [g('custom-esp32-device-or-off-the-shelf'), 'products/'],
        },
        {
          id: 'scene',
          term: '场景',
          body: '一组一起执行的预设状态，比如看电影时调暗灯光、关上窗帘，一个指令完成。在门边或床边装一个无线场景按键，不用 App 的家人按一下就能用。',
          links: ['solutions/smart-lighting/', 'solutions/home-control/'],
        },
        {
          id: 'automation',
          term: '自动化',
          body: '系统自己执行的规则：发生某件事（到了某个时间、传感器读数、门被打开）就做某件事，比如衣柜湿度持续偏高时发通知。在本地系统里，自动化运行在你家的控制器上，断网也照常工作。',
          links: [g('singapore-humidity-mould-aircon-dry-mode-automation'), g('reduce-aircon-electricity-smart-home')],
        },
        {
          id: 'dashboard',
          term: '控制面板（仪表盘）',
          body: '手机、平板或墙面屏上的那一屏控制按钮。好的面板只放你真正会用的房间和功能，而不是把家里每个设备都列出来；在本地平台上，它在家里网络中不联网也能用。',
          links: ['solutions/home-control/', g('local-smart-home-vs-google-apple-smartthings')],
        },
      ],
    },
    {
      id: 'electrical',
      title: '电气与安装',
      terms: [
        {
          id: 'neutral-wire',
          term: '零线',
          body: '让电流从灯具流回去、构成回路的那根线。很多智能开关需要底盒里有零线来给自己供电，但不少老房子的零线直接走到灯具，开关底盒里只有火线和控制线。最好和电工一起打开一个底盒看看。',
          links: [g('no-neutral-smart-switches'), g('check-older-home-before-smart')],
        },
        {
          id: 'no-neutral-switch',
          term: '单火线开关',
          body: '靠灯具里流过的极小电流给自己供电的智能开关，灯关着时也一样。底盒里没有零线时可以用，但低功率 LED 可能闪烁或微微发光，常见的解决办法是在灯具处加一个旁路电容。可选型号也更少。',
          links: [g('no-neutral-smart-switches')],
        },
        {
          id: 'dimmer',
          term: '调光器',
          body: '替换墙面开关，可以调亮度而不只是开和关。灯泡或 LED 驱动必须和这款调光器兼容，买之前把两边的说明都看一遍。',
          links: [g('smart-switch-or-smart-bulb'), 'solutions/smart-lighting/'],
        },
        {
          id: 'switch-box',
          term: '开关底盒',
          body: '墙里装在开关后面的盒子。它里面的线，尤其是有没有零线，决定了能装哪种智能开关，所以零线、底盒和开关位置要在装修封墙之前定好。',
          links: [g('bto-key-collection-smart-home-timeline'), g('no-neutral-smart-switches')],
        },
        {
          id: 'distribution-board',
          term: '配电箱',
          body: '家里各路电路和断路器的起点。分路或全屋电量计量装在配电箱里，这是持牌电工的工作；加装要碰线路的设备之前，也值得先检查它的状况。',
          links: [g('reduce-aircon-electricity-smart-home'), g('check-older-home-before-smart')],
        },
        {
          id: 'licensed-electrical-worker',
          term: '持牌电工',
          body: '在新加坡，新增电路、墙内布线、开关底盒和配电箱的工作应交给持牌电工。电池传感器、智能插座和红外空调控制可以避开大部分这类工作。',
          links: [g('check-older-home-before-smart'), g('smart-home-during-hdb-renovation')],
        },
        {
          id: 'curtain-box',
          term: '窗帘盒',
          body: '窗户上方遮住窗帘轨道的盒子，一般由木工做。要确认深度放得下电机，如果纱帘和遮光帘都要，还得放得下两条轨道；用有线电机的话，旁边要预留电源插座。',
          links: [g('motorised-curtains-guide'), g('bto-key-collection-smart-home-timeline')],
        },
        {
          id: 'access-point',
          term: '无线接入点（AP）',
          body: '在固定位置发射 Wi-Fi、再连回路由器的设备。用网线连接的接入点通常比无线组网的 Mesh 节点更稳定，因为每多一跳无线中继都会损失一些性能。',
          links: [g('wifi-for-smart-home')],
        },
        {
          id: 'lan-cable',
          term: '网线（LAN / 以太网）',
          body: '埋在墙里通到房间的网络线缆。把网线拉到客厅、书房，以及接入点、网关或电视要放的位置，比只靠 Wi-Fi 可靠得多；在木工和吊顶之前做最容易。',
          links: [g('renovation-smart-home-prep'), g('bto-key-collection-smart-home-timeline')],
        },
      ],
    },
    {
      id: 'devices',
      title: '设备',
      terms: [
        {
          id: 'presence-radar',
          term: '人体存在雷达',
          body: '用低功率无线电波判断人在哪里、怎么移动的传感器，有些型号还能识别跌倒，不需要摄像头或麦克风。雷达不依赖光线，房间再暗也没问题。误报和漏报都会发生，应把它当作安全辅助，而不是医疗设备。',
          links: [g('radar-fall-detection'), g('smart-home-for-elderly-parents')],
        },
        {
          id: 'contact-sensor',
          term: '门窗磁',
          body: '装在门或窗上的小传感器，开、关时会上报。装在大门上，能看出深夜有没有开过门，或者早上到了平时的时间还没开过，全程不用摄像头。',
          links: [g('smart-home-for-elderly-parents'), g('renovation-smart-home-prep')],
        },
        {
          id: 'leak-sensor',
          term: '漏水传感器',
          body: '放在地上，一碰到水就报警：厨房水槽下、洗衣机旁或空调排水口下面。有些通过 Zigbee 等低功耗方式连接控制器，有些只支持 Wi-Fi。',
          links: [g('water-smoke-humidity-sensors-singapore'), g('singapore-humidity-mould-aircon-dry-mode-automation')],
        },
        {
          id: 'smart-plug',
          term: '智能插座',
          body: '插在插座和电器之间的转换器，可以用 App 或自动化来开关电器，有些还能计量这个电器的用电。适合台灯、风扇或除湿机，不适合直接接线的空调；电器通电后若停在待机状态、需要按键启动，它也按不了那个键。',
          links: [g('reduce-aircon-electricity-smart-home'), g('smart-home-for-renters')],
        },
        {
          id: 'digital-lock',
          term: '电子门锁',
          body: '除了钥匙，还能用指纹、密码或手机开的门锁。改装锁装在原有门锁上，整锁替换则要改动门体。买之前确认低电量提醒和机械钥匙备用，并且保证屋里的人随时不用密码、钥匙或手机就能迅速开门。',
          links: [g('smart-door-lock-guide'), g('smart-home-helpers-kids-guests-access')],
        },
        {
          id: 'video-doorbell',
          term: '可视门铃',
          body: '带摄像头的门铃，可以在手机上看到并应答门口的人。它会拍下来访者的画面和声音，所以要想好录像存在哪里；如果门铃会记录进出，要告诉受影响的人。',
          links: [g('smart-home-privacy-local-vs-cloud'), g('smart-home-helpers-kids-guests-access')],
        },
      ],
    },
    {
      id: 'singapore',
      title: '新加坡住房',
      terms: [
        {
          id: 'hdb',
          term: '组屋（HDB）',
          body: '建屋发展局（Housing & Development Board）是新加坡的公共住房机构，HDB 也指它建造的组屋。建屋局公布了组屋装修指引，部分工程开工前需要申请许可。',
          links: [g('smart-home-during-hdb-renovation'), 'homes/hdb-resale-smart-home/'],
        },
        {
          id: 'bto',
          term: 'BTO 预购组屋',
          body: 'Build-To-Order，建好之前就预购的新组屋。拿到钥匙后，顺序比购物清单更重要：开关位置、零线和网线要在木工和吊顶之前定好。',
          links: [g('bto-key-collection-smart-home-timeline'), 'homes/bto-smart-home/'],
        },
        {
          id: 'resale-flat',
          term: '转售组屋',
          body: '从原屋主手里买的二手组屋。开关底盒、线路和空调可能比控制它们的 App 还老，加新工程之前请电工先检查现有线路。',
          links: ['homes/hdb-resale-smart-home/', g('check-older-home-before-smart')],
        },
        {
          id: 'condo-mcst',
          term: '公寓与 MCST',
          body: '公寓（condo）是私人公寓项目，由管理机构 MCST 管理物业、制定装修规定。固定布线、改动大门以及任何涉及外立面的改动都可能受这些规定约束，一开始就把规定发给安装方。',
          links: [g('condo-smart-home-upgrade-cost-factors'), 'homes/condo-smart-home/'],
        },
        {
          id: 'landed',
          term: '有地住宅',
          body: '带独立地块的房子，比如排屋、半独立式洋房或独立洋房。首要问题通常不是自动化，而是覆盖：信号要到达每一层，大门和周界也需要照看。',
          links: ['homes/landed-smart-home/', g('wifi-for-smart-home')],
        },
        {
          id: 'interior-designer',
          term: 'ID（室内设计师）',
          body: '在新加坡，“ID”通常指你的室内设计师，他们常常负责协调各个工种、安排工期。尽早告诉 ID 你想做智能家居，布线、窗帘盒和网线才能在木工之前规划好。',
          links: [g('bto-key-collection-smart-home-timeline'), g('smart-home-during-hdb-renovation')],
        },
      ],
    },
    {
      id: 'business',
      title: '我们的硬件与信息屏',
      terms: [
        {
          id: 'esp32',
          term: 'ESP32',
          body: '一系列低成本的微控制器——只运行一个程序的小芯片，内置 Wi-Fi 和低功耗蓝牙。我们基于 ESP32 和 ESP32-S3 定制语音助手、触摸面板、传感器和继电器。因为带无线发射器，要商业销售的设备需要符合 IMDA 的要求。',
          links: [g('custom-esp32-device-or-off-the-shelf'), g('esp32-ai-voice-assistant-what-it-can-do')],
        },
        {
          id: 'lvgl',
          term: 'LVGL',
          body: '一个开源图形库，用来在微控制器驱动的小屏幕上做触摸界面。我们的触摸面板和桌面信息屏用 LVGL 开发，界面只为一个用途设计。',
          links: ['custom-hardware/', 'products/'],
        },
        {
          id: 'digital-signage',
          term: '信息屏（数字标牌）',
          body: '显示菜单、通知、欢迎语或当天会议的屏幕。一套信息屏由屏幕、播放器、内容管理方式和一个负责更新的人组成；缓存在播放器里的内容在断网时照样播放。Panda Signage 是自托管的。',
          links: [g('digital-signage-small-office-shop-singapore'), 'signage/'],
        },
        {
          id: 'room-panel',
          term: '会议室门牌',
          body: '装在会议室门边的小屏幕，显示房间是否空闲、下一场预订是什么。在 Panda Signage 里，预约在管理后台录入后显示在门牌和会议室列表屏上。',
          links: ['signage/', g('digital-signage-small-office-shop-singapore')],
        },
      ],
    },
  ],
}
