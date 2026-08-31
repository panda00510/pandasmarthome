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
    showroom: '3D Showroom',
    cta: 'Plan your system',
  },

  hero: {
    eyebrow: 'Open smart home · Singapore',
    titleLead: 'A home that answers to you,',
    titleAccent: 'not to the cloud.',
    lead: 'Lights, aircon, curtains, locks and cameras from different brands — running together on one local system you actually own.',
    primaryCta: 'Plan your system',
    secondaryCta: 'See what we install',
    trust: [
      'Runs locally, keeps working offline',
      'Mix brands without lock-in',
      'No subscription to switch on a light',
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
        body: 'Open source, maintained by a non-profit foundation. No subscription between you and your own light switch.',
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

  platform: {
    eyebrow: 'The platform',
    title: 'Built on Home Assistant',
    lead: 'An open-source platform that puts local control and privacy first, stewarded by the non-profit Open Home Foundation. The software under your home cannot be sold or moved behind a paywall.',
    points: [
      {
        title: 'A very wide device net',
        body: 'Over 1,500 integrations — mainstream brands, aircon systems, inverters, routers and cameras.',
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
    sourceNote:
      'Integration count and platform details as published on home-assistant.io. Panda Smart Home is an independent installer, not affiliated with the Home Assistant project or the Open Home Foundation.',
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
        imageAlt: 'HDB blocks in Punggol, Singapore, with solar panels on the rooftops',
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
        imageAlt: 'HDB residential blocks beside a canal near Segar LRT station, Singapore',
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
          'High-rise residential towers at Marina Bay, Singapore, seen from below',
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
        a: 'Not for the system itself. Home Assistant is open source and runs on hardware in your home. Optional extras — a cloud service you keep, or a support plan with us — are always stated separately.',
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
    lead: 'The best systems begin with how a household actually lives.',
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
    creditsHref: 'asset-sources.txt',
    rights: 'All rights reserved.',
    builtWith: 'Built on Home Assistant. Independent installer.',
    disclaimer:
      'Panda Smart Home integrates compatible third-party products through Home Assistant and supported connection methods. Product names and trademarks belong to their respective owners. Compatibility does not imply official partnership or endorsement.',
  },
}
