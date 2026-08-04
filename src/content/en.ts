import type { Content } from './types'

export const en: Content = {
  htmlLang: 'en',

  meta: {
    title: 'Panda Smart Home | Open Smart Home Solutions Singapore',
    description:
      'Panda Smart Home designs and installs open, local-first smart home systems for Singapore HDB, BTO, condo and landed homes — built on Home Assistant, with no vendor lock-in.',
    keywords:
      'smart home Singapore, Home Assistant Singapore, HDB smart home, BTO smart home, condo smart home, smart lighting Singapore, smart aircon control, smart curtains, Matter, Zigbee',
    ogImageAlt: 'Panda Smart Home — open smart home solutions in Singapore',
  },

  a11y: {
    skipToContent: 'Skip to main content',
    openMenu: 'Open navigation menu',
    closeMenu: 'Close navigation menu',
    homeLink: 'Panda Smart Home — back to top',
    languageSwitcher: 'Switch language',
  },

  nav: {
    items: [
      { id: 'why', label: 'Why open' },
      { id: 'solutions', label: 'Solutions' },
      { id: 'platform', label: 'Platform' },
      { id: 'homes', label: 'Your home' },
      { id: 'process', label: 'How it works' },
      { id: 'faq', label: 'FAQ' },
    ],
    cta: 'Plan your system',
  },

  hero: {
    eyebrow: 'Open smart home · Singapore',
    titleLead: 'A home that answers to you,',
    titleAccent: 'not to the cloud.',
    lead: 'Panda Smart Home designs, installs and tunes open smart home systems for Singapore apartments and houses. Lights, aircon, curtains, locks and cameras from different brands, running together on one local system you actually own.',
    primaryCta: 'Plan your system',
    secondaryCta: 'See what we install',
    trust: [
      'Runs locally, keeps working offline',
      'Mix brands without lock-in',
      'No monthly subscription to switch on a light',
      'Documented and handed over to you',
    ],
    imageAlt:
      'Bright modern apartment living room with large windows and contemporary furniture',
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
    lead: 'Every manufacturer wants its own app, its own account and its own hub. An open system removes those seams: one place to control everything, one place to automate it, and nothing that stops working because a company changed its mind.',
    items: [
      {
        id: 'local',
        title: 'Local first, private by default',
        body: 'Your automations run on hardware in your own home. Lights, switches and sensors keep responding when the internet drops, and day-to-day activity data does not have to leave the flat.',
      },
      {
        id: 'brands',
        title: 'One system, many brands',
        body: 'Choose devices on merit — the aircon controller that fits your unit, the lock your family likes, the lights that suit the ceiling. We connect them into a single interface instead of six apps.',
      },
      {
        id: 'nolockin',
        title: 'No lock-in, no surprise paywalls',
        body: 'The platform is open source and maintained by a non-profit foundation. There is no subscription standing between you and your own switches, and no single vendor that can strand your setup.',
      },
      {
        id: 'handover',
        title: 'Built to be handed over',
        body: 'You get the admin credentials, a written device and network inventory, and a walkthrough. If you ever want to take it over yourself — or bring in someone else — nothing is hidden.',
      },
    ],
  },

  solutions: {
    eyebrow: 'Solutions',
    title: 'What we design and install',
    lead: 'Every home gets a different mix. These are the areas we work in most often for Singapore properties, and what a well-executed version of each actually looks like.',
    items: [
      {
        id: 'lighting',
        title: 'Lighting & scenes',
        body: 'Smart lighting that respects how a room is really used — warm and dim in the evening, bright and neutral for cleaning, and no hunting for the right app at midnight.',
        bullets: [
          'Smart switches, dimmers or smart bulbs, chosen per circuit',
          'Neutral-wire and no-neutral solutions for older HDB wiring',
          'Scene control from wall switches, phone or voice',
          'Physical switches always keep working',
        ],
      },
      {
        id: 'climate',
        title: 'Aircon & comfort',
        body: 'Singapore comfort is an aircon and humidity problem. We bring split units and fans into the system so they respond to schedules, presence and actual room conditions.',
        bullets: [
          'IR or manufacturer-module control for common split systems',
          'Room temperature and humidity sensors, not guesswork',
          'Auto-off when a bedroom window opens or the room empties',
          'Bedtime and wake-up climate schedules per room',
        ],
      },
      {
        id: 'shades',
        title: 'Curtains & blinds',
        body: 'Motorised tracks and roller blinds integrated properly, so morning light, afternoon heat and privacy are handled without anyone touching a remote.',
        bullets: [
          'Motorised curtain tracks, roller and zip blinds',
          'Sunrise, sunset and west-sun heat scheduling',
          'Partial-open positions for glare control',
          'Coordinated with lighting and aircon scenes',
        ],
      },
      {
        id: 'security',
        title: 'Doors & security',
        body: 'Digital locks, door sensors and cameras that report to one dashboard — with local recording options so your footage stays in your home.',
        bullets: [
          'Digital lock and gate status in one view',
          'Door, window and motion sensors with useful alerts',
          'Local NVR / network camera recording where supported',
          'Away, home and night modes that change what gets watched',
        ],
      },
      {
        id: 'control',
        title: 'Control surfaces',
        body: 'A system is only as good as the way people reach it. We build interfaces for everyone in the household, including guests and helpers who never installed an app.',
        bullets: [
          'Custom phone and tablet dashboards',
          'Wall-mounted tablet or scene keypads',
          'Voice assistants, including local voice options',
          'Simple mode for family members who just want a button',
        ],
      },
      {
        id: 'energy',
        title: 'Energy & monitoring',
        body: 'See where the electricity actually goes. Useful for aircon-heavy homes and for anyone with solar or an EV charger.',
        bullets: [
          'Whole-home or per-circuit energy monitoring',
          'Aircon runtime and consumption breakdowns',
          'Water leak, smoke and gas sensor integration',
          'Alerts that reach you before a problem becomes damage',
        ],
      },
    ],
  },

  platform: {
    eyebrow: 'The platform',
    title: 'Built on Home Assistant',
    lead: 'We build on Home Assistant, an open-source home automation platform that puts local control and privacy first. It is stewarded by the non-profit Open Home Foundation, which means the software underneath your home cannot simply be sold, discontinued or moved behind a paywall.',
    points: [
      {
        title: 'A very wide device net',
        body: 'Home Assistant lists over 1,500 integrations — from mainstream smart home brands to aircon systems, inverters, routers and network cameras. If a device speaks a documented protocol, there is usually a way in.',
      },
      {
        title: 'Automations that read the room',
        body: 'Rules can combine time, sunlight, presence, temperature, humidity and door state. That is the difference between a light on a timer and a home that simply behaves correctly.',
      },
      {
        title: 'Runs on hardware in your home',
        body: 'We size and install the controller — official Home Assistant hardware or a small always-on server — sited in your DB box area, TV console or store room with wired network where possible.',
      },
      {
        title: 'Remote access, on your terms',
        body: 'Secure remote access is optional and configured deliberately. Nothing about the day-to-day operation of the house depends on a remote server being reachable.',
      },
    ],
    protocolsTitle: 'Protocols we work with',
    hubLabel: 'Your home',
    protocols: [
      { label: 'Matter', note: 'Cross-brand standard, local by design' },
      { label: 'Thread', note: 'Low-power mesh for battery devices' },
      { label: 'Zigbee', note: 'Mature mesh for lights, sensors, switches' },
      { label: 'Z-Wave', note: 'Separate radio band, strong for locks' },
      { label: 'Wi-Fi / LAN', note: 'Local APIs where the vendor exposes them' },
      { label: 'Bluetooth LE', note: 'Presence, trackers, compact sensors' },
      { label: 'ESPHome', note: 'Custom sensors and controllers' },
      { label: 'MQTT / Modbus', note: 'Inverters, meters, industrial gear' },
    ],
    sourceNote:
      'Integration count and platform details as published on home-assistant.io. Panda Smart Home is an independent installer and is not affiliated with the Home Assistant project or the Open Home Foundation.',
  },

  homes: {
    eyebrow: 'Your home',
    title: 'Different homes, different constraints',
    lead: 'A 4-room resale flat, a BTO you have not collected yet and a condo with an MCST all need different plans. What matters is matching the system to the wiring, the renovation timeline and the rules you actually have to live with.',
    items: [
      {
        id: 'bto',
        title: 'BTO & new keys',
        subtitle: 'Best possible timing',
        body: 'Before renovation is the cheapest moment to get this right. Deciding switch positions, neutral wires, network points and curtain track power at the electrical layout stage costs almost nothing extra — retrofitting them later costs hacking.',
        bullets: [
          'Smart-ready electrical and network layout review',
          'Neutral wires and deeper back boxes where needed',
          'Curtain track power planned before false ceiling',
          'Coordinated with your ID and electrician',
        ],
        imageAlt: 'HDB blocks in Punggol, Singapore, with solar panels on the rooftops',
      },
      {
        id: 'hdb',
        title: 'HDB resale & existing flats',
        subtitle: '3-room to executive',
        body: 'Existing flats can be upgraded without tearing up walls. We survey what your wiring actually supports, then pick devices that fit it — including no-neutral switch options and battery sensors where running cable is not worth it.',
        bullets: [
          'Wiring survey before anything is ordered',
          'No-neutral and retrofit-friendly device options',
          'Works around existing lights and aircon you like',
          'Staged rollout — start with one area, extend later',
        ],
        imageAlt: 'HDB residential blocks beside a canal near Segar LRT station, Singapore',
      },
      {
        id: 'condo',
        title: 'Condominiums',
        subtitle: 'Working within MCST rules',
        body: 'Condos bring their own constraints: renovation windows, restrictions on facade and common-area changes, and building-provided systems that may need to coexist rather than be replaced.',
        bullets: [
          'Solutions that respect MCST renovation rules',
          'Coexist with building intercom and access systems',
          'Wireless-first approach where drilling is restricted',
          'Multi-zone aircon and large-window shading',
        ],
        imageAlt:
          'High-rise residential towers at Marina Bay, Singapore, seen from below',
      },
      {
        id: 'landed',
        title: 'Landed & larger homes',
        subtitle: 'Multi-storey, multi-household',
        body: 'Bigger homes need real network design before they need clever automations. Coverage across floors, a gate and perimeter to cover, and several generations with different expectations of how a light switch should work.',
        bullets: [
          'Structured network and mesh coverage planning',
          'Gate, perimeter and multi-camera integration',
          'Per-floor and per-household zones',
          'Simple physical controls alongside the app',
        ],
        imageAlt: 'Landed houses along a quiet residential street in Singapore',
      },
    ],
    note: 'Scope and pricing are quoted after a site assessment. We do not publish package prices that would need a dozen assumptions to be meaningful.',
  },

  process: {
    eyebrow: 'How it works',
    title: 'From first conversation to handover',
    lead: 'A predictable process, with a written plan before any device is bought.',
    steps: [
      {
        title: 'Consultation',
        body: 'We talk through how the household actually lives — who is home when, what annoys you today, what your renovation timeline looks like, and what you already own.',
      },
      {
        title: 'Survey & system design',
        body: 'A site visit or detailed floor plan review. We check wiring, network and mounting realities, then produce a written device list, network plan and scope with clear assumptions.',
      },
      {
        title: 'Coordination',
        body: 'We work alongside your interior designer, contractor and electrician so wiring, back boxes and network points land in the right places before the walls close.',
      },
      {
        title: 'Installation & configuration',
        body: 'Devices installed, controller commissioned, network segmented, dashboards built and automations tuned against how the rooms are really used.',
      },
      {
        title: 'Handover & support',
        body: 'A walkthrough for the household, written documentation, admin credentials, and a support arrangement for changes, additions and the occasional firmware surprise.',
      },
    ],
    note: 'Electrical work is carried out by appropriately licensed personnel in accordance with Singapore requirements.',
  },

  compatibility: {
    eyebrow: 'Compatibility',
    title: 'Brands and systems we commonly integrate',
    lead: 'This is an indicative list of what we encounter in Singapore homes, not a catalogue of what we sell. Some products integrate locally, some only through a cloud API, and some models within a brand behave differently — we confirm the specific model before it goes into a plan.',
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
      'Panda Smart Home integrates compatible third-party products through Home Assistant and supported connection methods. Product names and trademarks belong to their respective owners. Compatibility does not imply official partnership or endorsement.',
    haCaption: 'Home Assistant — the open-source platform our systems are built on.',
  },

  faq: {
    eyebrow: 'FAQ',
    title: 'Questions worth asking before you start',
    lead: 'The things people actually want to know, answered without marketing gloss.',
    items: [
      {
        q: 'What happens when the internet goes down?',
        a: 'The core of your home keeps working. Automations, wall switches, sensors, scene buttons and local dashboards run on the controller in your home, so lights, aircon and curtains behave normally. Only features that genuinely need the internet — remote access from outside, cloud-only devices and some voice services — pause until the connection returns.',
      },
      {
        q: 'Do I need to rewire or hack my walls?',
        a: 'Usually not. Many upgrades work with existing wiring using retrofit switch modules, no-neutral switches, battery sensors and wireless devices. If you are renovating or collecting a BTO, planning it into the electrical layout is cheaper and cleaner — but it is not a prerequisite.',
      },
      {
        q: 'Can I keep the devices I already bought?',
        a: 'Very often, yes. Bring your list to the consultation. Many popular brands integrate directly; a few work only through a cloud account, and a small number cannot be integrated in a way we would be comfortable relying on. We tell you which is which before you spend anything more.',
      },
      {
        q: 'Is there a monthly fee?',
        a: 'Not for the system itself. Home Assistant is open source and runs on hardware in your home. Some optional extras have their own costs — a cloud service you choose to keep, an optional remote-access subscription, or a support plan with us — and those are always stated separately.',
      },
      {
        q: 'What about my family, or a helper, who will not use an app?',
        a: 'That is a design requirement, not an afterthought. Physical switches keep working exactly as they always did, and we add wall keypads, scene buttons or a simple wall tablet screen so nobody needs a phone to turn on a light.',
      },
      {
        q: 'How private is this, really?',
        a: 'Substantially more private than a stack of vendor apps, because the automation logic and the history stay on your hardware. It is not absolute: any device you choose that talks to its manufacturer will keep doing so. We flag which devices in your plan reach the internet and why, and offer local-only alternatives where they exist.',
      },
      {
        q: 'Can I take over the system myself later?',
        a: 'Yes, and we build with that in mind. You receive the administrator credentials, documentation of the devices, network and automations, and no proprietary layer that only we can service.',
      },
      {
        q: 'How long does an installation take?',
        a: 'A focused single-area retrofit is often a day or two. A whole-home system coordinated with a renovation is spread across the renovation timeline, with our work scheduled around the electrical and carpentry stages. You get an indicative schedule with the written scope.',
      },
    ],
  },

  contact: {
    eyebrow: 'Get in touch',
    title: 'Tell us about your home',
    lead: 'Share your home type and what you would like to solve first. We will come back with an honest view of what is worth doing, in what order, and what it depends on.',
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
      message: 'What would you like to solve?',
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
    emailCta: 'Email us',
    mailSubject: 'Smart home enquiry',
  },

  cta: {
    title: 'Start with a conversation, not a shopping list.',
    lead: 'The best systems begin with how a household actually lives. Tell us that, and the device list writes itself.',
    primary: 'Plan your system',
    secondary: 'Read the FAQ',
  },

  footer: {
    blurb:
      'Open, local-first smart home design and installation for Singapore homes, built on Home Assistant.',
    navTitle: 'Explore',
    legalTitle: 'Legal',
    contactTitle: 'Contact',
    credits: 'Image credits & licences',
    // Resolved against import.meta.env.BASE_URL in Footer.tsx — no leading
    // slash, so it survives being served from a sub-path.
    creditsHref: 'asset-sources.txt',
    rights: 'All rights reserved.',
    builtWith: 'Built on Home Assistant. Independent installer.',
    disclaimer:
      'Panda Smart Home integrates compatible third-party products through Home Assistant and supported connection methods. Product names and trademarks belong to their respective owners. Compatibility does not imply official partnership or endorsement.',
  },
}
