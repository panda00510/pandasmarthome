import type { Content } from './types'

export const en: Content = {
  htmlLang: 'en',

  meta: {
    title: 'Panda Smart Home | Open Smart Home Solutions Singapore',
    description:
      'Smart home design and installation for HDB, BTO, condo and landed homes in Singapore. Also Panda Signage displays, custom AI hardware and custom software.',
    keywords:
      'smart home Singapore, smart home installation Singapore, smart home company Singapore, smart home solutions Singapore, home automation Singapore, smart home system Singapore, whole home automation, HDB smart home, BTO smart home, BTO renovation smart home, condo smart home, landed house smart home, smart lighting Singapore, smart switch Singapore, no neutral smart switch, smart aircon control Singapore, smart curtains Singapore, motorised curtains Singapore, motorised blinds Singapore, digital lock Singapore, smart door lock Singapore, CCTV installation Singapore, home security Singapore, energy monitoring, Matter, Zigbee, Thread, Apple Home, Google Home, Alexa',
    ogImageAlt: 'Panda Smart Home — open smart home solutions in Singapore',
  },

  a11y: {
    skipToContent: 'Skip to main content',
    openMenu: 'Open navigation menu',
    closeMenu: 'Close navigation menu',
    homeLink: 'Panda Smart Home — back to top',
    languageSwitcher: 'Switch language',
    navPrimary: 'Primary',
    navMobile: 'Primary mobile',
    navFooter: 'Footer',
  },

  nav: {
    items: [
      { id: 'solutions', label: 'Services' },
      { id: 'products', label: 'Products' },
      { id: 'software', label: 'Software' },
      { id: 'homes', label: 'Your home' },
      { id: 'process', label: 'How it works' },
    ],
    showroom: '3D showroom',
    cta: 'Book a consultation',
  },

  hero: {
    showroomCta: 'Try the 3D showroom',
    eyebrow: 'Open smart home · Singapore',
    titleLead: 'A home that answers to you,',
    titleAccent: 'not to the cloud.',
    lead: 'Lights, aircon, curtains, locks and cameras from different brands — running together on one local system you actually own.',
    primaryCta: 'Book a consultation',
    secondaryCta: 'See what we install',
    trust: [
      'Runs locally, keeps working offline',
      'Mix brands without lock-in',
      'No subscription to switch on a light',
      'Documented and handed over to you',
    ],
    also: {
      label: 'Also from Panda',
      signage: 'Panda Signage',
      hardware: 'Custom AI hardware',
      software: 'Custom software',
    },
    imageAlt:
      'Illustrative photo: modern living room with a corner sofa, curtains and track lighting',
    panel: {
      title: 'Home',
      subtitle: 'All systems normal',
      rooms: ['Living', 'Master', 'Kitchen', 'Bedroom'],
      scenes: [
        { name: 'Good morning', detail: 'Curtains open · Aircon off' },
        { name: 'Movie night', detail: 'Lights 15% · Blinds down' },
        { name: 'Away', detail: 'Locks armed · Cameras on' },
      ],
      status: 'Local control · interactive demo',
    },
  },

  value: {
    eyebrow: 'Why open',
    title: 'Most smart homes break at the seams between brands.',
    lead: 'Every manufacturer wants its own app, its own account and its own hub. An open system removes those seams.',
    items: [
      {
        id: 'local',
        title: 'Local first, private by default',
        body: 'Automations run on hardware in your home. Switches and sensors keep responding when the internet drops.',
      },
      {
        id: 'brands',
        title: 'One system, many brands',
        body: 'Choose devices on merit, not on which hub you already own. One interface instead of six apps.',
      },
      {
        id: 'nolockin',
        title: 'No lock-in, no paywalls',
        body: 'Built on open-source software. No subscription between you and your own light switch.',
      },
      {
        id: 'handover',
        title: 'Built to be handed over',
        body: 'You get the admin credentials, a written device inventory and a walkthrough. Nothing is hidden.',
      },
    ],
  },

  solutions: {
    eyebrow: 'Solutions',
    title: 'What we design and install',
    lead: 'Every home gets a different mix. These are the areas we work in most often.',
    items: [
      {
        id: 'lighting',
        title: 'Lighting & scenes',
        body: 'Warm and dim in the evening, bright for cleaning, and no hunting for the right app at midnight.',
        bullets: [
          'Smart switches, dimmers or bulbs, chosen per circuit',
          'No-neutral options for older HDB wiring',
          'Physical switches always keep working',
        ],
      },
      {
        id: 'climate',
        title: 'Aircon & comfort',
        body: 'Comfort here is an aircon and humidity problem. Split units and fans respond to real room conditions.',
        bullets: [
          'IR or manufacturer-module control for common split units',
          'Temperature and humidity sensors, not guesswork',
          'Auto-off when a window opens or the room empties',
        ],
      },
      {
        id: 'shades',
        title: 'Curtains & blinds',
        body: 'Morning light, afternoon heat and privacy handled without anyone touching a remote.',
        bullets: [
          'Motorised curtain tracks, roller and zip blinds',
          'Sunrise, sunset and west-sun scheduling',
          'Partial-open positions for glare control',
        ],
      },
      {
        id: 'security',
        title: 'Doors & security',
        body: 'Digital locks, door sensors and cameras on one dashboard, with local recording where supported.',
        bullets: [
          'Digital lock and gate status in one view',
          'Door, window and motion sensors with useful alerts',
          'Away, home and night modes',
        ],
      },
      {
        id: 'control',
        title: 'Control surfaces',
        body: 'A system is only as good as the way people reach it — including guests and helpers who never installed an app.',
        bullets: [
          'Custom phone and tablet dashboards',
          'Wall-mounted tablet or scene keypads',
          'Simple mode for anyone who just wants a button',
        ],
      },
      {
        id: 'energy',
        title: 'Energy & monitoring',
        body: 'See where the electricity actually goes. Useful for aircon-heavy homes, solar or an EV charger.',
        bullets: [
          'Whole-home or per-circuit monitoring',
          'Aircon runtime and consumption breakdowns',
          'Water leak, smoke and gas sensors',
        ],
      },
    ],
  },

  hubs: {
    solutions: {
      eyebrow: 'Solutions',
      title: 'What we design and install',
      lead: 'Each area of the home on its own page: what we set up, what to decide first, and the questions people ask.',
      all: 'All solutions',
      metaTitle: 'Smart Home Solutions in Singapore | Panda Smart Home',
      metaDescription:
        'Smart lighting, aircon control, motorised curtains, door locks and security, home controls and energy monitoring for Singapore homes.',
    },
    homes: {
      eyebrow: 'Your home',
      title: 'Smart home plans by home type',
      lead: 'New BTO flats, older HDB flats, condominiums and landed homes each need a different plan. Start with the one closest to yours.',
      all: 'All home types',
      metaTitle: 'Smart Home for HDB, BTO, Condo & Landed | Panda Smart Home',
      metaDescription:
        'Smart home planning for BTO flats, HDB resale and older homes, condominiums and landed houses in Singapore.',
    },
  },

  products: {
    eyebrow: 'Products',
    title: 'Desk screen devices and smart home devices',
    lead: 'Finished screen devices: an enclosure, an interface and firmware already installed. They are not in stock yet. The prices are indicative starting prices, confirmed on WhatsApp before you order. Stock and support are in Singapore. Further down are the smart home devices we supply and install as part of a plan.',
    metaTitle: 'Desk Screen Devices & Smart Home Devices | Panda',
    metaDescription:
      'Pre-order desk screen devices in Singapore, plus the switches, sensors, curtain motors, locks and hubs we supply and install as part of a plan.',
    status: 'Pre-order / Coming soon',
    priceLabel: 'Indicative price',
    priceFrom: 'from {amount}',
    illustration: 'Illustration',
    enquire: 'Pre-order on WhatsApp',
    enquireTemplate: "Hi Panda Smart Home, I'd like to pre-order the {product} (indicative price {price}).",
    enquireAll:
      "Hi Panda Smart Home, I'd like to pre-order a desk screen device (voice assistant, touch panel, pixel clock or weather display). Please tell me the timing and the price.",
    homeTitle: 'Screen devices, ready to plug in',
    homeLead:
      'Four finished desk devices — a voice assistant, a touch panel, a pixel clock and a weather display. Not in stock yet: open for pre-order, with indicative prices.',
    homeCustom: 'We can customize the features to what you need.',
    homeCta: 'See the products',
    custom: {
      eyebrow: 'Custom',
      title: 'Custom features on request',
      body: 'Tell us what you need — screen layout, data sources like NEA weather or bus arrivals, Home Assistant integration, languages, branding for shops or offices — and we will build it into the firmware.',
      examples: ['Screen layout', 'NEA weather', 'Bus arrivals', 'Home Assistant', 'Languages', 'Shop or office branding'],
      cta: 'Request customization',
      message:
        "Hi Panda Smart Home, I'd like custom features on a desk screen device (screen layout, data, Home Assistant, languages or branding). Here's what I need: ",
      cardTemplate: "Hi Panda Smart Home, I'd like to customize the {product}. Here's what I need: ",
      tag: 'Customizable',
    },
    noteLabel: 'Worth knowing.',
    points: [
      {
        title: 'Singapore stock and support',
        body: 'Sold and supported from Singapore, so there is someone here to ask. This batch is not in stock yet.',
      },
      {
        title: 'Pre-configured, plug in and use',
        body: 'Enclosure, screen and firmware are already in place. These are not bare boards to assemble.',
      },
      {
        title: 'Chinese and English setup guide',
        body: 'Each device comes with a setup guide in Chinese and English.',
      },
      {
        title: 'USB 5V power',
        body: 'Powered from USB 5V. A mains power adapter is not included.',
      },
      {
        title: 'Add it to an installation',
        body: 'Any of these can be bundled with a smart home installation. Installation is quoted separately.',
      },
    ],
    items: [
      {
        id: 'voice',
        title: 'AI Voice Assistant Desk Device',
        short: 'Voice assistant',
        summary: 'A desk device that listens and replies in Chinese and English, with a screen that shows expressions.',
        body: 'Built on an ESP32-S3 board and based on the Xiaozhi voice assistant. The enclosure, screen and firmware are already installed, and it is powered by USB-C.',
        priceSgd: 69,
        specs: ['ESP32-S3', 'Chinese and English voice', 'Screen with expressions', 'USB-C power'],
        note: 'A mains power adapter is not included. The setup guide is in Chinese and English.',
      },
      {
        id: 'panel',
        title: 'Home Assistant Touch Panel',
        short: 'Touch panel',
        summary: 'A 4–7 inch touchscreen on a desk stand, opened onto a Home Assistant dashboard prepared for Singapore.',
        body: 'An ESP32-S3 panel running ESPHome and LVGL, pre-configured for Home Assistant, with an NEA weather card and an LTA bus-arrival card. It needs a Home Assistant system to connect to. The desk stand is included.',
        priceSgd: 89,
        specs: [
          'ESP32-S3, 4–7 inch touchscreen',
          'ESPHome and LVGL',
          'Works with Home Assistant',
          'NEA weather and LTA bus arrival',
          'Desk stand included',
        ],
        note: 'The size within 4–7 inches is confirmed when you enquire. Wall-mounting is an installation service, quoted separately — the price here is for the desk unit. A mains power adapter is not included.',
      },
      {
        id: 'pixel',
        title: 'Smart Pixel Clock',
        short: 'Pixel clock',
        summary: 'A 32×8 pixel display for the time, plus local weather, bus arrivals and notifications.',
        body: 'An AWTRIX-style 32×8 pixel display in an enclosure, pre-flashed with Home Assistant integration. With a Home Assistant system it can show the time, local weather, bus arrivals and notifications. Powered by USB 5V.',
        priceSgd: 65,
        specs: [
          '32×8 pixel display',
          'Pre-flashed for Home Assistant',
          'Time, local weather, bus arrivals, notifications',
          'USB 5V power',
        ],
        note: 'Weather, bus and notification views need a Home Assistant system. A mains power adapter is not included.',
      },
      {
        id: 'weather',
        title: 'Desk Weather & Clock Display',
        short: 'Weather display',
        summary: 'A small colour screen for NEA weather, the time and a calendar.',
        body: 'An ESP32 and a colour screen in an enclosure. It shows NEA weather, the time and a calendar, and uses Wi-Fi to load the weather. Powered by USB 5V.',
        priceSgd: 35,
        specs: ['ESP32 and a colour screen', 'NEA weather, time and calendar', 'USB 5V power'],
        note: 'A mains power adapter is not included. This is a desk display, not a Home Assistant panel.',
      },
    ],
    finePrint: [
      'Not in stock. The status on every device is pre-order / coming soon. We confirm timing on WhatsApp before you commit.',
      '“From S$X” is an indicative starting price in Singapore dollars, not a checkout price. The amount you pay is agreed before anything is ordered.',
      'The drawings are illustrations, not photographs of finished units.',
      'No mains power adapter is included. Each device runs on USB 5V.',
    ],
    nav: { group: 'Products', devices: 'Desk screen devices', install: 'Smart home devices' },
    install: {
      eyebrow: 'Supplied and installed',
      title: 'Smart home devices we supply and install',
      lead: 'The devices that go into a home we set up. We pick models that run on your local network over Zigbee, Thread or Matter, so they keep working without the internet and are not tied to one brand.',
      note: 'No prices are listed here. The right model depends on your wiring, your walls and what you already own, so these are quoted as part of a plan after we have seen the home.',
      cta: 'Ask about devices for your home',
      message: "Hi Panda Smart Home, I'd like to ask about smart home devices for my home. My home type and what I want to control: ",
      learn: 'How we plan this',
      groups: [
        {
          id: 'switches-lighting',
          title: 'Switches and lighting',
          body: 'Wall switches that still work by hand, and lights that dim and change tone with the time of day.',
          items: [
            'Smart wall switches, including no-neutral types for older wiring',
            'Dimmers',
            'Smart bulbs and LED strips',
            'Wireless scene buttons',
          ],
          path: 'solutions/smart-lighting/',
        },
        {
          id: 'sensors',
          title: 'Sensors',
          body: 'Small battery or mains sensors that let the home react on its own and warn you early.',
          items: [
            'Presence radar and motion sensors',
            'Door and window contacts',
            'Temperature and humidity sensors',
            'Water-leak sensors',
            'Smoke alarms',
          ],
          path: 'guides/water-smoke-humidity-sensors-singapore/',
        },
        {
          id: 'curtains-locks-security',
          title: 'Curtains, locks and security',
          body: 'Motorised curtains and blinds, the main door, and cameras that record locally where the model supports it.',
          items: [
            'Curtain motors and tracks',
            'Roller blind motors',
            'Digital door locks',
            'Video doorbells',
            'Cameras with local recording',
          ],
          path: 'solutions/smart-door-locks/',
        },
        {
          id: 'hubs-gateways',
          title: 'Hubs and gateways',
          body: 'The box that runs the home locally, and the bridges that connect each kind of device to it.',
          items: [
            'Local hub with Home Assistant pre-installed',
            'Zigbee, Thread and Matter gateways',
            'Infrared aircon controllers',
            'Smart plugs and energy meters',
          ],
          path: 'solutions/home-control/',
        },
      ],
    },
    preparing:
      'The AI edge box for existing CCTV and the camera-free fall sensor are still being prepared. They are not part of this list.',
    preparingLink: 'See what is still in preparation',
    faqTitle: 'Before you pre-order',
    faq: [
      {
        q: 'Are these in stock?',
        a: 'No. They are open for pre-order and marked coming soon. Message us on WhatsApp and we will confirm timing before you commit to anything.',
      },
      {
        q: 'Can you customize the features?',
        a: 'Yes. Tell us the screen layout, the data you want (such as NEA weather or bus arrivals), Home Assistant integration, languages, or branding for a shop or office. We confirm what can go into the firmware, and the price, on WhatsApp before you order.',
      },
      {
        q: 'Is “from S$X” the price I pay?',
        a: 'It is an indicative starting price in Singapore dollars. The amount you pay is confirmed on WhatsApp before anything is ordered. Screen size and options can change it.',
      },
      {
        q: 'Does a power adapter come in the box?',
        a: 'No. Each device runs on USB 5V. A mains power adapter is not included.',
      },
      {
        q: 'Can you install one with a smart home?',
        a: 'Yes. Any of these can be bundled with a smart home installation, and that work is quoted separately. The touch panel can also be wall-mounted; the price on this page is for the desk unit with its stand.',
      },
      {
        q: 'Are the pictures of the real product?',
        a: 'No. They are illustrations of the kind of device, and each one is labelled as an illustration. There are no product photographs yet.',
      },
    ],
  },

  software: {
    eyebrow: 'Software',
    title: 'Custom software for small businesses',
    lead: 'Practical systems for shops and one-person businesses in Singapore. Built one-to-one, with the price written down before any work starts, and support in Chinese or English.',
    metaTitle: 'Small Business Software in Singapore | Panda Smart Home',
    metaDescription:
      'Booking, inventory, WhatsApp bots and simple internal tools for Singapore shops. Indicative prices from S$600, one-to-one, in English or Chinese.',
    whoTitle: 'Who this is for',
    audiences: [
      'Shops',
      'Food and beverage',
      'Salons',
      'Tuition centres',
      'Clinics',
      'Cleaning and moving',
      'Carousell and Shopee sellers',
      'Freelancers',
    ],
    points: [
      {
        title: 'One-to-one',
        body: 'You work with the person who designs and builds the system. There is no account team in between.',
      },
      {
        title: 'Transparent pricing',
        body: 'The quote says what is included, and what is not, before the build starts. The figures on this page are starting prices.',
      },
      {
        title: 'Chinese and English',
        body: 'The conversation, the system and the handover notes can be in either language.',
      },
    ],
    priceLabel: 'Indicative price',
    priceFrom: 'from {amount}',
    support: 'Includes 3 months of basic support. The final quote depends on scope.',
    packages: [
      {
        id: 'booking',
        title: 'Booking, scheduling and membership',
        body: 'A calendar for appointments and memberships, with reminders on WhatsApp. It can stay in sync with a calendar you already use, where that calendar allows it.',
        priceSgd: 1200,
        includes: ['Appointments and memberships', 'Calendar sync', 'WhatsApp reminders'],
      },
      {
        id: 'inventory',
        title: 'Inventory and simple ordering',
        body: 'Stock counts, a simple way to take orders, and reports you can read. It is a small system for one shop, not a full retail suite.',
        priceSgd: 1800,
        includes: ['Stock counts', 'Simple POS or ordering', 'Reports'],
      },
      {
        id: 'bot',
        title: 'WhatsApp or Telegram bot, with AI replies',
        body: 'A bot that answers common questions, takes bookings and sends notifications. What it is allowed to answer is written in the plan before it is built.',
        priceSgd: 800,
        includes: ['FAQ replies', 'Bookings', 'Notifications'],
      },
      {
        id: 'tool',
        title: 'Simple website, dashboard or internal tool',
        body: 'A small site, a dashboard, or a tool for a job you repeat. The quote lists exactly what it includes.',
        priceSgd: 600,
        includes: ['Website, dashboard or internal tool', 'Scope written in the quote'],
      },
      {
        id: 'roster',
        title: 'Staff rostering, attendance and workflows',
        body: 'Shifts, attendance and the routine steps between them, so the same checklist is not copied by hand.',
        priceSgd: 1000,
        includes: ['Rosters', 'Attendance', 'Routine workflows'],
      },
    ],
    hardwareTitle: 'Screens as well as software',
    hardwareBody:
      'A system can be paired with the screen devices on the products page — a menu screen, a queue display or an information screen — so the shop gets software and a screen built for it. Those devices are still on pre-order.',
    hardwareCta: 'See the screen devices',
    processTitle: 'How a job runs',
    steps: [
      { title: 'Chat on WhatsApp', body: 'Tell us what the business does and what is still done by hand.' },
      { title: 'Free requirement review', body: 'We write a short plan of what the system should do. The review has no charge.' },
      { title: 'Quote', body: 'A price for the agreed scope, including 3 months of basic support.' },
      { title: 'Build', body: 'The system is built to that plan. A change of scope is quoted before it is added.' },
      { title: 'Handover and support', body: 'You get the system, how to use it, and 3 months of basic support.' },
    ],
    enquire: 'I need a custom system',
    enquireAll:
      "Hi Panda Smart Home, I need a custom system for my small business. Here's what I need: ",
    enquireTemplate: "Hi Panda Smart Home, I need a custom system: {package}. Here's what I need: ",
    homeTitle: 'Custom software for small businesses',
    homeLead:
      'Booking, inventory, WhatsApp bots and simple internal tools for shops and freelancers. Indicative prices, quoted before any build.',
    homeCta: 'See the packages',
    finePrint: [
      '“From S$X” is an indicative starting price in Singapore dollars. What you pay depends on scope and is agreed before work starts.',
      'Each package includes 3 months of basic support. Later changes are quoted separately.',
      'These are starting points. If the job is smaller or larger than a package, the quote says so.',
    ],
    faqTitle: 'Before you ask for a quote',
    faq: [
      {
        q: 'Is this a smart home installation?',
        a: 'No. This page is software for a small business. Smart home installation is a separate service.',
      },
      {
        q: 'Is the price on the card what I pay?',
        a: 'It is a starting price. The quote depends on what the system has to do, and it is agreed before work starts. Each package includes 3 months of basic support.',
      },
      {
        q: 'Can a screen in the shop be part of it?',
        a: 'Yes. A menu screen, a queue display or an information screen can be part of the job. Those devices are listed on the products page and are still on pre-order.',
      },
    ],
  },

  showroom: {
    eyebrow: '3D showroom',
    title: 'Walk through a smart HDB flat before you commit',
    lead: 'Open the interactive 3D flat in your browser, switch scenes room by room, and see what each device does before anything is installed.',
    status: 'Local control · interactive demo',
    rooms: ['Living', 'Master', 'Kitchen', 'Bedroom'],
    plans: [
      { id: '3room', label: 'HDB 3-Room' },
      { id: '4room', label: 'HDB 4-Room' },
      { id: '5room', label: 'HDB 5-Room' },
    ],
  },

  custom: {
    nav: 'Custom',
    eyebrow: 'Products and custom builds',
    title: 'Our own products, and builds made for the job',
    lead: 'Our Panda Signage screen system, plus small AI and IoT devices built on ESP32 and software for shops and small teams. Quoted in writing before work starts.',
    devicesCta: 'Or see the ready-made screen devices',
  },

  hardware: {
    navLabel: 'Custom AI hardware',
    sectionEyebrows: { capabilities: 'Capabilities', levels: 'Levels', process: 'Process' },
    eyebrow: 'Custom AI hardware',
    title: 'Custom ESP32 AI and IoT devices, from idea to a working unit',
    lead: 'Small devices built on ESP32 and ESP32-S3 for individuals, shops and small teams in Singapore: voice assistants, touch screens, sensors and controllers. Prototypes and one-off builds, with the firmware and source handed over to you.',
    metaTitle: 'Custom ESP32 AI Hardware in Singapore | Panda Smart Home',
    metaDescription:
      'Custom ESP32 devices in Singapore: AI voice assistants, touch panels, sensors and Home Assistant, ESPHome, MQTT or Matter integration. Quoted in writing.',
    whoTitle: 'Who this is for',
    audiences: ['Individuals and makers', 'Shops and F&B', 'Offices and small teams', 'Smart home owners'],
    groupsTitle: 'What we can build',
    groups: [
      {
        id: 'voice',
        title: 'AI voice assistant devices',
        body: 'A small speaker device in the style of Xiaozhi, connected to a large language model, with a persona and knowledge you define.',
        items: ['LLM connection', 'Custom persona', 'Your own knowledge'],
      },
      {
        id: 'screen',
        title: 'Touch panels and desk information screens',
        body: 'Touch panels built with LVGL and desk information screens, with an interface designed for one purpose.',
        items: ['LVGL touch panels', 'Desk info screens'],
      },
      {
        id: 'sensor',
        title: 'Sensor and automation nodes',
        body: 'Small nodes that measure or switch: temperature and humidity, presence radar, power metering and relays.',
        items: ['Temperature and humidity', 'Presence radar', 'Power metering', 'Relays'],
      },
      {
        id: 'integration',
        title: 'Home Assistant, ESPHome, MQTT and Matter integration',
        body: 'Devices that join the system you already run, without a vendor cloud in the middle.',
        items: ['Home Assistant', 'ESPHome', 'MQTT', 'Matter'],
      },
      {
        id: 'local',
        title: 'NEA weather and LTA bus data',
        body: 'Screens and devices that show Singapore data: NEA weather and LTA bus arrivals.',
        items: ['NEA weather', 'LTA bus arrivals'],
      },
      {
        id: 'shop',
        title: 'Queue and menu screens for shops',
        body: 'Queue number displays and menu screens for a shop counter.',
        items: ['Queue number displays', 'Menu screens'],
      },
    ],
    tiersTitle: 'Three levels of custom',
    tiers: [
      {
        title: 'New firmware or interface for an existing device',
        body: 'Keep the hardware you have and change what it does or how it looks.',
        priceSgd: 150,
      },
      {
        title: 'Off-the-shelf board with custom firmware',
        body: 'A proven development board with firmware written for the job.',
        priceSgd: 350,
      },
      {
        title: 'A prototype from scratch',
        body: 'When nothing existing fits: a prototype designed around the job, tried and revised with you.',
        priceSgd: 800,
      },
    ],
    tierPriceLabel: 'Indicative price',
    tierPriceFrom: 'from {amount}',
    tiersNote:
      'These are prototypes and one-off custom builds, not certified mass-produced products. If a device with a radio transmitter is to be sold commercially, IMDA requirements apply; we assess that once you have confirmed how the device will be used.',
    processTitle: 'How a build runs',
    steps: [
      { title: 'Talk it through', body: 'Tell us what the device should do, where it will sit and who will use it.' },
      { title: 'Feasibility and written quote', body: 'We check what is feasible and put the scope and price in writing.' },
      { title: 'Prototype', body: 'A first working unit, built to the agreed scope.' },
      { title: 'Try and revise', body: 'You use it, we adjust it. A change of scope is quoted before it is added.' },
      { title: 'Handover', body: 'The device, the firmware, the source and the documentation are yours. No lock-in.' },
    ],
    priceTitle: 'Pricing',
    priceBody:
      'Custom builds start from S$150 for new firmware on a device you already have, S$350 for an off-the-shelf board with custom firmware, and S$800 for a prototype from scratch. These are indicative starting prices; parts, enclosure and scope change the total, and the price you pay is written in the quote before work starts.',
    pairTitle: 'Device and software together',
    pairBody:
      'A device can come with the software around it: a back office, a mini-program or a dashboard. Both sides are designed, quoted and handed over together.',
    enquire: 'Discuss a custom device',
    enquireAll: "Hi Panda Smart Home, I'd like to discuss a custom ESP32 device. Here's what it should do: ",
    homeTitle: 'Custom AI hardware',
    homeLead:
      'ESP32 voice assistants, touch screens, sensors and controllers for homes, shops and small teams. Prototypes and one-off builds, with the source handed over.',
    homeCta: 'Explore custom hardware',
    finePrint: [
      'Prototypes and one-off custom builds only. These are not certified mass-produced products.',
      'Commercial sale of a device with a radio transmitter needs IMDA compliance, assessed once the use is confirmed.',
      'Firmware, source code and documentation are handed over to you at the end of the job.',
    ],
    faqTitle: 'Before you ask for a quote',
    faq: [
      {
        q: 'Can the device work offline?',
        a: 'Sensors, screens and controls can run fully on your local network. Features that call a large language model or an online data source need the internet for that part; the quote says which parts do.',
      },
      {
        q: 'Which AI model does it use, and who pays for it?',
        a: 'We agree the model provider with you. Usage is billed by the provider to your own account, so you can see and control the cost.',
      },
      {
        q: 'What happens to my data?',
        a: 'Local features keep data on your network. When a feature sends voice or text to an AI provider, the plan says what is sent and to whom before it is built.',
      },
      {
        q: 'Is there a warranty or ongoing maintenance?',
        a: 'Support and maintenance terms are written into the quote for each build. Because you receive the source, you are not tied to us for later changes.',
      },
      {
        q: 'Can it join my existing smart home?',
        a: 'Yes, where your system supports it: Home Assistant, ESPHome, MQTT or Matter.',
      },
      {
        q: 'Do you take on a single-unit build?',
        a: 'Yes. A custom build can be a single device.',
      },
    ],
  },

  signage: {
    navLabel: 'Panda Signage',
    sectionEyebrows: { capabilities: 'Capabilities', setup: 'Screens and hosting', process: 'Process', related: 'Works with' },
    eyebrow: 'Panda Signage',
    title: 'Digital signage and meeting room displays, run from one place',
    lead: 'Panda Signage is our own system for information screens and meeting room door panels. Manage every screen across your sites from one browser, keep content playing when the network drops, and run it on your own server.',
    metaTitle: 'Digital Signage Singapore | Meeting Room Displays',
    metaDescription:
      'Digital signage and meeting room booking panels for Singapore offices, schools, clinics and shops. Self-hosted, plays offline, quoted in writing.',
    whoTitle: 'Who this is for',
    audiences: ['Offices', 'Coworking spaces', 'Schools and training centres', 'Clinics', 'Retail and F&B'],
    groupsTitle: 'What it does',
    groups: [
      {
        id: 'sites',
        title: 'Many sites, many screens, one console',
        body: 'Organise screens by client, location and folder. Each person sees only what their role allows.',
        items: ['HQ admin', 'Site admin', 'Operator', 'Front desk'],
      },
      {
        id: 'media',
        title: 'Upload what you already have',
        body: 'Images and videos, plus PDF and PowerPoint files that are turned into pages automatically. Large videos get a TV-compatible copy; the original is kept.',
        items: ['Images', 'Video', 'PDF', 'PPT / PPTX'],
      },
      {
        id: 'layout',
        title: 'Drag-and-drop layouts and templates',
        body: 'Build a screen from blocks and save it as a template for the next one.',
        items: ['Images', 'Video', 'Text', 'Clock', 'Weather', 'RSS ticker'],
      },
      {
        id: 'rooms',
        title: 'Meeting room door panels and room lists',
        body: 'Bookings that span several days or rooms, private meetings, a meeting shown up to four hours before it starts, and arrows that point people the right way.',
        items: ['Room bookings', 'Multi-room', 'Private meetings', 'Show ahead', 'Wayfinding arrows'],
      },
      {
        id: 'frontdesk',
        title: 'Quick text edits and emergency messages',
        body: 'Front-desk staff can change marked text on a screen, or put an emergency notice over every screen at a location, without touching the layout.',
        items: ['Quick text edit', 'Emergency notice'],
      },
      {
        id: 'offline',
        title: 'Keeps playing without the network',
        body: 'Content is cached on each player, so a dropped connection does not blank the screen. You can also export an offline pack and update a player from a USB drive.',
        items: ['Local cache', 'USB offline pack'],
      },
      {
        id: 'updates',
        title: 'Remote player updates, in batches',
        body: 'Update the player app on a few screens first, then the rest. Pause or cancel a rollout if something looks wrong.',
        items: ['Batched rollout', 'Pause / cancel'],
      },
      {
        id: 'language',
        title: 'English and Chinese console',
        body: 'The management console is available in English and Simplified Chinese.',
        items: ['English', '简体中文'],
      },
    ],
    setupTitle: 'What you need, and where it runs',
    setup: [
      {
        id: 'screens',
        title: 'Screens and players',
        body: 'The player runs on Android 11 or later: an Android media player behind any TV or monitor, or a commercial display with Android built in. Other platforms are assessed on request.',
        items: ['Android 11+ player box', 'Android commercial display', 'Other platforms: on request'],
      },
      {
        id: 'hosting',
        title: 'Your server, your data',
        body: 'Panda Signage is a self-hosted system. It is installed on your own server or office network, so your content and bookings stay with you. If you would rather not run a server, we can look at hosting it for you, assessed per project.',
        items: ['Your own server', 'Office network', 'Hosting by us: assessed per project'],
      },
    ],
    processTitle: 'How a rollout runs',
    steps: [
      { title: 'Talk it through', body: 'How many screens and sites, what they should show, and who will update them.' },
      { title: 'Written quote', body: 'Scope, screens, deployment and price, in writing before anything starts.' },
      { title: 'Install and configure', body: 'We install the system, set up sites, roles and the first templates, and connect the players.' },
      { title: 'Trial and adjust', body: 'Your team uses it on real screens; we adjust layouts and settings.' },
      { title: 'Handover and training', body: 'We show your team how to update content, bookings and emergency notices.' },
    ],
    priceTitle: 'Pricing',
    priceBody:
      'These are indicative starting prices. Screens and player boxes are not included, and hosting by us is quoted separately. The price you pay is written in the quote before work starts.',
    priceLabel: 'Indicative price',
    priceFrom: 'from {amount}',
    prices: [
      {
        title: 'Setup for one site',
        body: 'Installed on your server, with up to 5 screens connected, your first templates and a training session.',
        priceSgd: 800,
      },
      {
        title: 'Each additional screen',
        body: 'Adding a player to the system and assigning it to a site and a template.',
        priceSgd: 60,
      },
      {
        title: 'Meeting room door panels',
        body: 'Room booking set up, door panel and room list templates, and staff shown how to book.',
        priceSgd: 400,
      },
    ],
    relatedTitle: 'Goes well with',
    related: [
      {
        id: 'hardware',
        title: 'Custom ESP32 screens',
        body: 'Small dedicated screens, such as a queue number display or a counter menu screen, built on ESP32.',
        cta: 'Custom hardware',
      },
      {
        id: 'software',
        title: 'Custom software',
        body: 'Booking pages, back offices and small tools for shops and teams, designed around how you work.',
        cta: 'Custom software',
      },
      {
        id: 'home',
        title: 'Smart home and room control',
        body: 'Lighting, aircon and curtains on one local system. Tying a room to its meeting schedule is assessed per project.',
        cta: 'Services',
      },
    ],
    enquire: 'Discuss your screens',
    enquireAll: "Hi Panda Smart Home, I'd like to discuss Panda Signage. Number of screens / sites: ",
    homeTitle: 'Panda Signage',
    homeLead:
      'Information screens and meeting room door panels for offices, schools, clinics and shops, managed from one console and hosted on your own server.',
    homeCta: 'Explore Panda Signage',
    art: {
      headline: 'Welcome',
      room: 'Room 3',
      status: 'Available',
      next: 'Next 14:00',
      admin: 'Console',
      screens: 'Screens',
    },
    finePrint: [
      'The drawings on this page are illustrations, not screenshots of a live system.',
      'Features are delivered as set out in the written scope at the time of delivery.',
      'Screens and players must run Android 11 or later; other platforms are assessed on request.',
    ],
    faqTitle: 'Before you ask for a quote',
    faq: [
      {
        q: 'Does it keep playing if the internet goes down?',
        a: 'Yes. Content is cached on each player and keeps playing. Changes reach the screen once it is back online. A player can also be updated from a USB drive with an exported offline pack.',
      },
      {
        q: 'Which screens does it support?',
        a: 'Android 11 or later: an Android media player connected to a TV or monitor, or a commercial display with Android built in. We do not promise other platforms; they are assessed on request.',
      },
      {
        q: 'Who updates the content, and is it hard?',
        a: 'Your own team, from a web browser. Layouts are built by drag and drop, PDF and PowerPoint files are converted automatically, and front-desk staff can change marked text without touching the layout. Training is part of the handover.',
      },
      {
        q: 'Where is our data kept?',
        a: 'On the server where the system is installed, which is normally your own server or office network. If we host it for you, where it runs is written into the quote.',
      },
      {
        q: 'Can it show meeting room bookings?',
        a: 'Yes. Bookings are entered in the console and appear on the door panel and on room list screens. Connecting an existing booking system is assessed per project.',
      },
      {
        q: 'Do you take on a single screen?',
        a: 'Yes. A rollout can start with one screen and grow later.',
      },
    ],
  },

  upcoming: {
    eyebrow: 'Coming next',
    title: 'Smarter eyes and safer care, without a new camera system',
    lead: 'Two products we are preparing. They are not on sale yet. Tell us what you would use them for and we will let you know when there is something to try.',
    status: 'In development',
    strip: 'Two products we are preparing, not on sale yet: an AI box for existing CCTV and a camera-free fall sensor.',
    limitsLabel: 'Worth knowing',
    items: [
      {
        id: 'edge',
        title: 'AI edge box for your existing CCTV',
        body: 'A small box on your own network that reads the streams from cameras you already have and adds analytics. Video is processed on site rather than sent to a cloud service.',
        bullets: [
          'Designed for ONVIF / RTSP cameras you already own',
          'People counting for shops, offices and entrances',
          'Alerts for unusual events, such as movement in an area at an unexpected hour',
          'Counts and alerts shown on the same local dashboard',
        ],
        limits:
          'Which cameras work depends on their stream format, lighting and mounting angle. We check yours before promising anything.',
      },
      {
        id: 'fall',
        title: 'Fall detection without a camera',
        body: 'A radar sensor that notices a fall and raises an alert without capturing images or sound. Meant for bathrooms and bedrooms, where a camera is not appropriate.',
        bullets: [
          'No video or audio recorded',
          'Alerts to family phones or your dashboard',
          'Planned: flag when a room has been still for unusually long',
        ],
        limits:
          'Radar still senses movement and presence, and one sensor covers a limited area, so larger rooms may need several. It is an extra safety aid, not a medical device or a replacement for care. We will test it in real homes before quoting accuracy.',
      },
    ],
    note: 'Counting people and monitoring spaces involves personal data. In Singapore, organisations using CCTV have duties under the PDPA, including telling people why footage is collected. We plan for this with you.',
    cta: 'Tell us your use case',
  },

  deliver: {
    eyebrow: 'What you receive',
    title: 'Written records you can check, not promises',
    lead: 'Before any device is ordered, and again at handover, you get the details in writing. These are illustrations of the document types.',
    items: [
      {
        id: 'scope',
        tag: 'Before ordering',
        title: 'Written scope and device list',
        body: 'The rooms, devices and work we agree, in writing, before anything is ordered.',
      },
      {
        id: 'plan',
        tag: 'Before installing',
        title: 'Network and wiring plan',
        body: 'Where the controller, access points and cabling go, and what your wiring can support.',
      },
      {
        id: 'handover',
        tag: 'At handover',
        title: 'Handover pack',
        body: 'Admin credentials, a device inventory and a walkthrough, so you can run the system yourself.',
      },
    ],
    demoCta: 'Explore the demo system',
    note: 'Illustrations only. The documents for your home are written for your home.',
  },

  platform: {
    eyebrow: 'The platform',
    title: 'Your own system, running at home',
    lead: 'Open-source software on a controller in your home. No vendor cloud in the middle, and nothing that can be moved behind a paywall.',
    points: [
      {
        title: 'A very wide device net',
        body: 'Mainstream brands, aircon systems, inverters, routers and cameras — on one system.',
      },
      {
        title: 'Automations that read the room',
        body: 'Rules combine time, sunlight, presence, temperature and door state — not just a timer.',
      },
      {
        title: 'Runs on hardware in your home',
        body: 'We size and install the controller, on wired network where possible.',
      },
      {
        title: 'Remote access, on your terms',
        body: 'Optional and configured deliberately. Nothing day-to-day depends on a remote server.',
      },
    ],
    protocolsTitle: 'Protocols we work with',
    outcomes: ['Keeps working offline', 'Mix brands freely', 'Handed over, easy to maintain'],
    nodes: ['Lights', 'Aircon', 'Curtains'],
    compatLabel: 'Compatibility and protocols',
    hubLabel: 'Your home',
    protocols: [
      { label: 'Matter', note: 'Cross-brand standard, local by design' },
      { label: 'Thread', note: 'Low-power mesh for battery devices' },
      { label: 'Zigbee', note: 'Mature mesh for lights and sensors' },
      { label: 'Z-Wave', note: 'Separate radio band, strong for locks' },
      { label: 'Wi-Fi / LAN', note: 'Local APIs where the vendor exposes them' },
      { label: 'Bluetooth LE', note: 'Presence, trackers, compact sensors' },
      { label: 'ESPHome', note: 'Custom sensors and controllers' },
      { label: 'MQTT / Modbus', note: 'Inverters, meters, industrial gear' },
    ],
  },

  homes: {
    eyebrow: 'Your home',
    title: 'Different homes, different constraints',
    lead: 'A resale flat, a BTO you have not collected yet and a condo with an MCST each need a different plan.',
    items: [
      {
        id: 'bto',
        title: 'BTO & new keys',
        subtitle: 'Best possible timing',
        body: 'Before renovation is the cheapest moment to get this right. Switch positions, neutral wires and network points cost almost nothing at the layout stage — and hacking later.',
        bullets: [
          'Smart-ready electrical and network layout review',
          'Neutral wires and deeper back boxes where needed',
          'Coordinated with your ID and electrician',
        ],
        imageAlt: 'Illustrative photo: high-rise apartment blocks among trees',
      },
      {
        id: 'hdb',
        title: 'HDB resale & existing flats',
        subtitle: '3-room to executive',
        body: 'Existing flats upgrade without tearing up walls. We survey what your wiring actually supports, then pick devices that fit it.',
        bullets: [
          'Wiring survey before anything is ordered',
          'No-neutral and retrofit-friendly options',
          'Staged rollout — start with one area, extend later',
        ],
        imageAlt: 'Illustrative photo: a colourful residential block beside an open lawn',
      },
      {
        id: 'condo',
        title: 'Condominiums',
        subtitle: 'Working within MCST rules',
        body: 'Renovation windows, facade restrictions, and building systems that need to coexist rather than be replaced.',
        bullets: [
          'Solutions that respect MCST renovation rules',
          'Coexist with building intercom and access systems',
          'Wireless-first where drilling is restricted',
        ],
        imageAlt:
          'Illustrative photo: condominium towers beside a river and bridge',
      },
      {
        id: 'landed',
        title: 'Landed & larger homes',
        subtitle: 'Multi-storey, multi-household',
        body: 'Bigger homes need real network design before clever automations: coverage across floors, a perimeter to cover, and several generations with different expectations.',
        bullets: [
          'Structured network and mesh coverage planning',
          'Gate, perimeter and multi-camera integration',
          'Simple physical controls alongside the app',
        ],
        imageAlt: 'Illustrative photo: a modern house with terraces behind a tree',
      },
    ],
    areas: {
      title: 'Serving homes across Singapore',
      lead: 'HDB estates, condos and landed homes in every region.',
      regions: [
        { name: 'Central', towns: 'Bishan · Toa Payoh · Queenstown · Bukit Merah · Bukit Timah · Novena' },
        { name: 'East', towns: 'Tampines · Bedok · Pasir Ris' },
        { name: 'North', towns: 'Woodlands · Yishun · Sembawang' },
        { name: 'North-East', towns: 'Punggol · Sengkang · Hougang · Ang Mo Kio · Serangoon' },
        { name: 'West', towns: 'Jurong · Bukit Batok · Choa Chu Kang · Clementi · Bukit Panjang · Tengah' },
      ],
    },
    note: 'Scope and pricing are quoted after a site assessment. We do not publish package prices that would need a dozen assumptions to be meaningful.',
  },

  process: {
    eyebrow: 'How it works',
    title: 'From first conversation to handover',
    lead: 'A predictable process, with a written plan before any device is bought.',
    steps: [
      {
        title: 'Consultation',
        body: 'How the household actually lives, what annoys you today, and what you already own.',
      },
      {
        title: 'Survey & system design',
        body: 'A site visit or floor plan review, then a written device list, network plan and scope.',
      },
      {
        title: 'Coordination',
        body: 'We work alongside your interior designer, contractor and electrician before the walls close.',
      },
      {
        title: 'Installation & configuration',
        body: 'Devices installed, controller commissioned, dashboards built and automations tuned.',
      },
      {
        title: 'Handover & support',
        body: 'A walkthrough, written documentation, admin credentials, and a support arrangement.',
      },
    ],
    note: 'Electrical work is carried out by appropriately licensed personnel in accordance with Singapore requirements.',
  },

  compatibility: {
    eyebrow: 'Compatibility',
    title: 'Brands and systems we commonly integrate',
    lead: 'An indicative list of what we meet in Singapore homes, not a catalogue of what we sell. Some products integrate locally, some only through a cloud API — we confirm the specific model before it goes into a plan.',
    groups: [
      {
        title: 'Lighting & switches',
        brands: [
          'Philips Hue',
          'IKEA',
          'Aqara',
          'Sonoff',
          'Shelly',
          'Yeelight',
          'Tuya-based brands',
          'Zigbee & Matter switches',
        ],
      },
      {
        title: 'Air conditioning & fans',
        brands: [
          'Daikin',
          'Mitsubishi Electric',
          'Panasonic',
          'LG',
          'Samsung',
          'Midea',
          'IR-controlled split units',
          'DC ceiling fans',
        ],
      },
      {
        title: 'Curtains, blinds & motors',
        brands: [
          'Aqara',
          'SwitchBot',
          'Zemismart',
          'Somfy',
          'Dooya',
          'Tuya motor controllers',
        ],
      },
      {
        title: 'Locks, access & sensors',
        brands: [
          'igloohome',
          'Yale',
          'Samsung digital locks',
          'Kaadas',
          'Aqara sensors',
          'SwitchBot',
          'Zigbee & Z-Wave contact sensors',
        ],
      },
      {
        title: 'Cameras & recording',
        brands: [
          'Reolink',
          'Hikvision',
          'Dahua',
          'Ubiquiti',
          'ONVIF / RTSP cameras',
          'Frigate local NVR',
        ],
      },
      {
        title: 'Voice, media & ecosystems',
        brands: [
          'Apple Home',
          'Google Home',
          'Amazon Alexa',
          'Sonos',
          'Chromecast',
          'Local voice assistants',
        ],
      },
    ],
    disclaimer:
      'Panda Smart Home integrates compatible third-party products through supported connection methods. Product names and trademarks belong to their respective owners. Compatibility does not imply official partnership or endorsement.',
  },

  faq: {
    more: 'More questions',
    eyebrow: 'FAQ',
    title: 'Questions worth asking before you start',
    lead: 'The things people actually want to know, answered without marketing gloss.',
    items: [
      {
        q: 'Which areas of Singapore do you cover?',
        a: 'Homes across Singapore — HDB estates, condos and landed properties in every region, from Punggol and Tampines to Jurong, Woodlands and the city centre.',
      },
      {
        q: 'Do you work within HDB and condo renovation rules?',
        a: 'Yes. We plan around HDB renovation guidelines and your MCST rules, and electrical work is carried out by appropriately licensed personnel.',
      },
      {
        q: 'Can we talk in Chinese?',
        a: 'Yes — English or Chinese, whichever the household prefers.',
      },
      {
        q: 'What happens when the internet goes down?',
        a: 'The core keeps working. Automations, wall switches, sensors and local dashboards all run on the controller in your home. Only remote access and cloud-only devices pause until the connection returns.',
      },
      {
        q: 'Do I need to rewire or hack my walls?',
        a: 'Usually not. Retrofit switch modules, no-neutral switches and battery sensors work with existing wiring. Planning it into a renovation is cheaper and cleaner, but it is not a prerequisite.',
      },
      {
        q: 'Can I keep the devices I already bought?',
        a: 'Very often, yes — bring your list to the consultation. Most popular brands integrate directly; a few work only through a cloud account. We tell you which is which before you spend anything more.',
      },
      {
        q: 'Is there a monthly fee?',
        a: 'Not for the system itself. It is open source and runs on hardware in your home. Optional extras — a cloud service you keep, or a support plan with us — are always stated separately.',
      },
      {
        q: 'What about family who will not use an app?',
        a: 'Physical switches keep working exactly as they always did. We add wall keypads, scene buttons or a simple wall tablet so nobody needs a phone to turn on a light.',
      },
      {
        q: 'How private is this, really?',
        a: 'The automation logic and history stay on your hardware, which is a large step up from a stack of vendor apps. It is not absolute: any device you choose that talks to its manufacturer will keep doing so. We flag which ones do, and offer local-only alternatives where they exist.',
      },
      {
        q: 'Can I take over the system myself later?',
        a: 'Yes, and we build with that in mind. You receive the administrator credentials and full documentation, with no proprietary layer only we can service.',
      },
      {
        q: 'How long does an installation take?',
        a: 'A focused single-area retrofit is often a day or two. A whole-home system runs alongside your renovation timeline. You get an indicative schedule with the written scope.',
      },
    ],
  },

  contact: {
    eyebrow: 'Get in touch',
    title: 'Tell us about your home',
    lead: 'Share your home type and what you would like to solve first. We will come back with an honest view of what is worth doing, and in what order.',
    detailsTitle: 'Contact',
    pendingDetails: 'Contact details to be confirmed',
    pendingDetailsNote:
      'Phone, email and WhatsApp are not published yet. Once configured, they appear here and in the buttons above.',
    labels: {
      email: 'Email',
      phone: 'Phone',
      whatsapp: 'WhatsApp',
      address: 'Office',
      serviceArea: 'Service area',
    },
    form: {
      title: 'Enquiry',
      name: 'Name',
      namePlaceholder: 'How should we address you?',
      contact: 'Email or phone',
      contactPlaceholder: 'you@example.com or +65 …',
      contactHelp: 'Used only to reply to this enquiry.',
      homeType: 'Home type',
      homeTypeOptions: [
        'Select…',
        'BTO / new keys',
        'HDB resale or existing flat',
        'Condominium',
        'Landed property',
        'Other / not sure yet',
      ],
      startWith: 'What would you like to start with? (optional)',
      startWithOptions: [
        'Select…',
        'Lighting & scenes',
        'Aircon & comfort',
        'Curtains & blinds',
        'Doors & security',
        'Controls & dashboards',
        'Energy & monitoring',
        'Custom AI hardware (ESP32)',
        'Digital signage',
        'Not sure yet, advise me',
      ],
      message: 'What would you like to solve? (optional)',
      messagePlaceholder:
        'e.g. Aircon in two bedrooms, curtains in the living room, and one app for everything.',
      submit: 'Send enquiry',
      submitViaEmail: 'Send by email',
      submitting: 'Sending…',
      consent: 'By sending this enquiry you agree that we handle your contact details as described in our {privacy}.',
      privacyLink: 'privacy policy',
      viaEmailNote:
        'This opens your email app with the enquiry filled in — press send there and it comes straight to us.',
    },
    states: {
      unconfiguredTitle: 'Form endpoint not configured',
      unconfiguredBody:
        'This deployment has no form endpoint and no contact email set, so the form cannot submit and will not pretend to. Set VITE_FORM_ENDPOINT or VITE_CONTACT_EMAIL in the environment to enable it.',
      successTitle: 'Enquiry sent',
      successBody: 'Thank you — we have received your message and will be in touch.',
      mailtoTitle: 'Your email app should now be open',
      mailtoBody:
        'The enquiry has been filled in for you. It only reaches us once you press send in your email app.',
      mailtoFallback: 'Nothing opened? Email us directly at',
      errorTitle: 'Could not send',
      errorBody:
        'Something went wrong sending the form. Please try again, or reach us through one of the contact channels listed.',
      required: 'This field is required.',
      invalidContact: 'Enter a valid email address or phone number.',
    },
    whatsappCta: 'Message on WhatsApp',
    whatsappGreeting: "Hi Panda Smart Home, I'd like to plan a smart home.",
    emailCta: 'Email us',
    mailSubject: 'Smart home enquiry',
  },

  cta: {
    title: 'Start with a conversation, not a shopping list.',
    lead: 'The best systems begin with how a household actually lives.',
    primary: 'Book a consultation',
    secondary: 'Read the FAQ',
  },

  guides: {
    eyebrow: 'Guides',
    title: 'Straight answers before you buy',
    lead: 'Plain-language notes on the questions Singapore homeowners ask us most.',
    metaTitle: 'Smart Home Guides for Singapore Homes | Panda Smart Home',
    metaDescription:
      'Practical smart home guides for HDB, condo and landed homes in Singapore — wiring, local control, devices and planning.',
    all: 'All guides',
    updated: 'Updated',
    byline: 'By the Panda Smart Home team',
    more: 'More guides',
    backHome: 'Back to home',
    related: 'Related guides',
    learnMore: 'Learn more',
    pagesTitle: 'Solutions and home types',
    ctaTitle: 'Planning a smart home?',
    ctaBody: 'Tell us about your home and we will suggest what fits, in English or Chinese.',
    ctaButton: 'Book a consultation',
    topics: {
      start: 'Getting started',
      renovation: 'Renovation',
      energy: 'Energy and comfort',
      care: 'Care at home',
      security: 'Security and safety',
      business: 'Business and custom',
    },
    allTopics: 'All topics',
    featured: 'Start here',
    readMin: '{n} min read',
    keyPoints: 'The short version',
    contents: 'On this page',
    showMore: 'Show more guides',
    companyTitle: 'Company details',
    companyName: 'Name',
    registration: 'Registration no. (UEN)',
  },

  checklist: {
    metaTitle: 'Printable Smart Home Renovation Checklist | Panda Smart Home',
    metaDescription:
      'A one-page list for your ID and electrician: control, power and network for each room, plus five checks before the walls and ceilings close.',
    eyebrow: 'Printable checklist',
    title: 'Smart home checklist before renovation',
    lead: 'Give this page to your ID or contractor and your electrician: one row per room for control, power and network, filled in before the wiring quote and checked again before the walls and ceilings close.',
    print: 'Print or save as PDF',
    printNote: 'Tick the boxes on paper. Nothing you tick on screen is saved.',
    fields: ['Home / unit', 'ID or contractor', 'Electrical worker', 'Date'],
    columns: {
      room: 'Room',
      control: 'Control: switches, neutral wires, buttons',
      power: 'Power: points for curtains, door, hub',
      network: 'Network: LAN points, access points',
    },
    rows: [
      {
        room: 'Living and dining',
        control: [
          'Switch positions where people reach for the light',
          'Neutral wire at each switch box you may automate',
          'Scene button beside the window for the curtains',
          'Aircon: controller can see the indoor unit, or a wired adapter',
        ],
        power: ['Power point at the curtain box (wired motor)', 'Power where the hub or access point will sit'],
        network: ['LAN cable to the TV and the hub', 'Access point location'],
      },
      {
        room: 'Master bedroom',
        control: [
          'Switches on both sides of the bed',
          'Neutral wire at each switch box you may automate',
          'Aircon: controller can see the indoor unit',
        ],
        power: [
          'Power point at the curtain box (wired motor)',
          'Curtain box deep enough for track, motor and a second layer',
        ],
        network: ['Wi-Fi checked with a phone where devices will sit', 'LAN cable if an access point goes here'],
      },
      {
        room: 'Other bedrooms and study',
        control: [
          'Bedside switch position',
          'Neutral wire at each switch box you may automate',
          'Aircon: controller can see the indoor unit',
        ],
        power: ['Power point at the curtain box (wired motor)'],
        network: ['LAN cable to the study', 'Wi-Fi checked where devices will sit'],
      },
      {
        room: 'Kitchen',
        control: ['Switch positions', 'Neutral wire at each switch box you may automate'],
        power: [],
        network: ['Wi-Fi checked where devices will sit'],
      },
      {
        room: 'Bathrooms',
        control: ['Switch positions', 'Neutral wire at each switch box you may automate'],
        power: [],
        network: [],
      },
      {
        room: 'Entrance and main door',
        control: [
          'Switch at the entrance',
          'Smart lock: door material, thickness and existing lock checked',
          'Mechanical key override kept',
          'A place to mount the door sensor',
        ],
        power: ['Power point near the main door'],
        network: ['Wi-Fi checked at the door (metal doors weaken it)'],
      },
      {
        room: 'Service yard',
        control: ['Switch positions'],
        power: [],
        network: ['Network point: can it go where coverage reaches the bedrooms?'],
      },
      {
        room: 'Distribution board and data point',
        control: [
          'Fixed wiring by a licensed electrical worker',
          'Resale flat: existing wiring checked before new work',
        ],
        power: ['Space in the board for circuit-level energy monitoring'],
        network: ['Router out in the open, not shut in a cupboard', 'Wired connection for the hub'],
      },
    ],
    finalTitle: 'Check again before the walls and ceilings close',
    final: [
      'Every switch box, cable and power point is where this list says',
      'LAN cables are labelled at both ends',
      'Curtain box depth confirmed for any motorised track',
      'Access panels left for anything above the ceiling; hubs and power supplies can be reached',
      'The aircon controller can still see each indoor unit once the cabinets are in',
    ],
    notes: [
      "Fixed electrical work is for a licensed electrical worker. Renovation rules for HDB flats and condominiums vary: read HDB's current guidelines, and ask your contractor which works need a permit.",
      'Prepare the wiring and network first; choose devices once the layout is final.',
      'Whatever you choose, a wall switch should still work as a plain switch if the app, hub or internet is down.',
    ],
    sourcesTitle: 'Where this list comes from',
    sources: [
      { label: 'Planning a smart home before renovation', path: 'guides/renovation-smart-home-prep/' },
      { label: 'Smart home during an HDB renovation', path: 'guides/smart-home-during-hdb-renovation/' },
      { label: 'Smart switches without a neutral wire', path: 'guides/no-neutral-smart-switches/' },
      { label: 'Wi-Fi for a smart home', path: 'guides/wifi-for-smart-home/' },
      { label: 'Motorised curtains', path: 'guides/motorised-curtains-guide/' },
      { label: 'Smart door locks', path: 'guides/smart-door-lock-guide/' },
    ],
  },

  notFound: {
    metaTitle: 'Page not found | Panda Smart Home',
    metaDescription: 'This page does not exist. Find smart home services, products, guides and the 3D showroom from Panda Smart Home.',
    eyebrow: 'Error 404',
    title: 'This page doesn’t exist.',
    lead: 'The link may be old or mistyped. Everything else is still here — pick a place to continue.',
    linksTitle: 'Where to next',
    home: 'Home',
    contact: 'Contact us',
  },

  footer: {
    blurb:
      'Open, local-first smart home design and installation for homes across Singapore.',
    navTitle: 'Explore',
    legalTitle: 'Legal',
    contactTitle: 'Contact',
    credits: 'Image credits & licences',
    creditsHref: 'asset-sources.txt',
    about: 'About us',
    privacy: 'Privacy policy',
    rights: 'All rights reserved.',
    builtWith: 'Serving HDB, condo and landed homes across Singapore.',
    disclaimer:
      'Panda Smart Home integrates compatible third-party products through supported connection methods. Product names and trademarks belong to their respective owners. Compatibility does not imply official partnership or endorsement.',
    imageTag: 'Illustrative photo',
    imageNote:
      'Photographs are illustrative stock images from Pexels. They are not Panda Smart Home installations or client projects.',
  },
}
