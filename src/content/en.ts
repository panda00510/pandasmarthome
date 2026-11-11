import type { Content } from './types'

export const en: Content = {
  htmlLang: 'en',

  meta: {
    title: 'Panda Smart Home | Open Smart Home Solutions Singapore',
    description:
      'Smart home design and installation across Singapore — HDB, BTO, condo and landed homes. Lighting, aircon, curtains, locks and cameras on one local system, with no vendor lock-in.',
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
    imageAlt:
      'Illustrative photo: modern living room with a corner sofa, curtains and track lighting',
    panel: {
      title: 'Home',
      subtitle: 'All systems normal',
      rooms: ['Living', 'Master', 'Kitchen', 'Study'],
      scenes: [
        { name: 'Good morning', detail: 'Curtains open · Aircon off' },
        { name: 'Movie night', detail: 'Lights 15% · Blinds down' },
        { name: 'Away', detail: 'Locks armed · Cameras on' },
      ],
      status: 'Local control · 42 devices online',
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
      metaTitle: 'Smart Home for HDB, BTO, Condo and Landed Homes in Singapore | Panda Smart Home',
      metaDescription:
        'Smart home planning for BTO flats, HDB resale and older homes, condominiums and landed houses in Singapore.',
    },
  },

  products: {
    eyebrow: 'Products',
    title: 'Desk devices you can plug in and use',
    lead: 'Finished screen devices: an enclosure, an interface and firmware already installed. They are not in stock yet. The prices are indicative starting prices, confirmed on WhatsApp before you order. Stock and support are in Singapore.',
    metaTitle: 'Desk Screen Devices to Pre-order | Panda Smart Home',
    metaDescription:
      'Pre-order screen-equipped desk devices in Singapore: an AI voice assistant, a Home Assistant touch panel, a 32×8 pixel clock and a weather display. Features can be customized. Indicative prices. Not in stock yet.',
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
        'Not sure yet, advise me',
      ],
      message: 'What would you like to solve? (optional)',
      messagePlaceholder:
        'e.g. Aircon in two bedrooms, curtains in the living room, and one app for everything.',
      submit: 'Send enquiry',
      submitViaEmail: 'Send by email',
      submitting: 'Sending…',
      consent:
        'By sending this enquiry you agree that we may use these details to respond to you.',
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
    },
    allTopics: 'All topics',
    featured: 'Start here',
    readMin: '{n} min read',
    keyPoints: 'The short version',
    contents: 'On this page',
    showMore: 'Show more guides',
  },

  footer: {
    blurb:
      'Open, local-first smart home design and installation for homes across Singapore.',
    navTitle: 'Explore',
    legalTitle: 'Legal',
    contactTitle: 'Contact',
    credits: 'Image credits & licences',
    creditsHref: 'asset-sources.txt',
    rights: 'All rights reserved.',
    builtWith: 'Serving HDB, condo and landed homes across Singapore.',
    disclaimer:
      'Panda Smart Home integrates compatible third-party products through supported connection methods. Product names and trademarks belong to their respective owners. Compatibility does not imply official partnership or endorsement.',
    imageTag: 'Illustrative photo',
    imageNote:
      'Photographs are illustrative stock images from Pexels. They are not Panda Smart Home installations or client projects.',
  },
}
