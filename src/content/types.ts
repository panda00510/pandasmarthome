/** Shape of the site copy. `en.ts` and `zh.ts` must both satisfy this. */

export type NavItem = { id: string; label: string }

export type Content = {
  htmlLang: string
  meta: {
    title: string
    description: string
    keywords: string
    ogImageAlt: string
  }
  a11y: {
    skipToContent: string
    /** The phone-only bar fixed to the bottom of the screen. */
    quickActions: string
    openMenu: string
    closeMenu: string
    homeLink: string
    languageSwitcher: string
    navPrimary: string
    navMobile: string
    navFooter: string
  }
  nav: {
    items: NavItem[]
    /** Label for the 3D showroom link. Not a NavItem: those are in-page
     *  anchors, this one leaves the page. */
    showroom: string
    cta: string
  }
  hero: {
    /** Overlay link on the hero photo into the 3D showroom. */
    showroomCta: string
    eyebrow: string
    titleLead: string
    titleAccent: string
    lead: string
    primaryCta: string
    secondaryCta: string
    trust: string[]
    /** Compact row under the trust strip linking the other three lines of business. */
    also: { label: string; signage: string; hardware: string; software: string }
    imageAlt: string
    panel: {
      title: string
      subtitle: string
      rooms: string[]
      scenes: { name: string; detail: string }[]
      status: string
    }
  }
  value: {
    eyebrow: string
    title: string
    lead: string
    items: { id: string; title: string; body: string }[]
  }
  solutions: {
    eyebrow: string
    title: string
    lead: string
    items: { id: string; title: string; body: string; bullets: string[] }[]
  }
  /** Index pages for the topic pages: /solutions/ and /homes/. */
  hubs: Record<'solutions' | 'homes', { eyebrow: string; title: string; lead: string; all: string; metaTitle: string; metaDescription: string }>
  /**
   * Finished screen devices open for pre-order. Not in stock yet.
   * Prices are indicative starting prices, never a checkout price.
   */
  products: {
    eyebrow: string
    /** Page heading. */
    title: string
    lead: string
    metaTitle: string
    metaDescription: string
    /** Shown on every product. e.g. "Pre-order / Coming soon". */
    status: string
    priceLabel: string
    /** "{amount}" is replaced with "S$69". */
    priceFrom: string
    /** Corner label on every drawing. */
    illustration: string
    enquire: string
    /** "{product}" and "{price}" are replaced. Names that product. */
    enquireTemplate: string
    /** WhatsApp message for the page-level button, already complete. */
    enquireAll: string
    homeTitle: string
    homeLead: string
    /** One line on the home strip: features can be customized. */
    homeCustom: string
    homeCta: string
    noteLabel: string
    /** Prominent "we build features to order" block. No price is stated. */
    custom: {
      eyebrow: string
      title: string
      body: string
      examples: string[]
      cta: string
      /** WhatsApp message for the page banner. Complete. */
      message: string
      /** "{product}" is replaced with the device name. */
      cardTemplate: string
      /** Short tag on every product card. */
      tag: string
    }
    points: { title: string; body: string }[]
    items: {
      id: string
      /** Full product name, used in the WhatsApp message. */
      title: string
      /** Short label for jump links. */
      short: string
      summary: string
      body: string
      /** Indicative starting price in Singapore dollars. */
      priceSgd: number
      specs: string[]
      note: string
    }[]
    /**
     * Smart home devices supplied and installed as part of a plan. No brand,
     * model, price or stock claim: these are quoted with the plan.
     */
    /** Header "Products" dropdown: its label and the two entries for this page. */
    nav: { group: string; devices: string; install: string }
    install: {
      eyebrow: string
      title: string
      lead: string
      /** Why no prices are shown. */
      note: string
      cta: string
      /** WhatsApp message for the section button. Complete. */
      message: string
      learn: string
      groups: {
        id: string
        title: string
        body: string
        items: string[]
        /** Site path of the page that explains this area. */
        path: string
      }[]
    }
    finePrint: string[]
    preparing: string
    preparingLink: string
    faqTitle: string
    faq: { q: string; a: string }[]
  }
  /**
   * Custom software for small businesses. Prices are indicative starting
   * prices. There is no checkout and no list of clients.
   */
  software: {
    eyebrow: string
    title: string
    lead: string
    metaTitle: string
    metaDescription: string
    whoTitle: string
    audiences: string[]
    points: { title: string; body: string }[]
    priceLabel: string
    /** "{amount}" is replaced with "S$1,200". */
    priceFrom: string
    /** Shown under every package price. */
    support: string
    packages: {
      id: string
      title: string
      body: string
      priceSgd: number
      includes: string[]
    }[]
    hardwareTitle: string
    hardwareBody: string
    hardwareCta: string
    processTitle: string
    steps: { title: string; body: string }[]
    enquire: string
    /** Page-level WhatsApp message. Complete. */
    enquireAll: string
    /** "{package}" is replaced with the package name. */
    enquireTemplate: string
    homeTitle: string
    homeLead: string
    homeCta: string
    finePrint: string[]
    faqTitle: string
    faq: { q: string; a: string }[]
  }
  /** Homepage band for the 3D showroom (separate build at /showroom/). */
  showroom: {
    eyebrow: string
    title: string
    lead: string
    /** Line on the video card saying it is a screen recording of the real showroom. */
    status: string
    /** Accessible names of the clip's play / pause button. */
    play: string
    pause: string
    /** Floor plans the showroom opens directly with ?plan=<id>. */
    plans: { id: string; label: string }[]
  }
  /** "Custom" group: header dropdown and the homepage band (hardware + software). */
  custom: {
    /** Header dropdown label. */
    nav: string
    eyebrow: string
    title: string
    lead: string
    /** Link to the products page from the homepage band. */
    devicesCta: string
  }
  /**
   * Custom ESP32 AI / IoT hardware. Prototypes and small batches only; no
   * client list, no lead times, no certification claims, no prices.
   */
  hardware: {
    /** Header dropdown and footer label. */
    navLabel: string
    /** Small labels above each section heading on the page. */
    sectionEyebrows: { capabilities: string; levels: string; process: string }
    eyebrow: string
    title: string
    lead: string
    metaTitle: string
    metaDescription: string
    whoTitle: string
    audiences: string[]
    groupsTitle: string
    groups: { id: string; title: string; body: string; items: string[] }[]
    tiersTitle: string
    /** `priceSgd` is an indicative starting price, shown as "from S$X". */
    tiers: { title: string; body: string; priceSgd: number }[]
    tierPriceLabel: string
    tierPriceFrom: string
    /** Prototype / small-batch and IMDA note under the tiers. */
    tiersNote: string
    processTitle: string
    steps: { title: string; body: string }[]
    priceTitle: string
    priceBody: string
    /** Cross-link card shared by the hardware and software pages. */
    pairTitle: string
    pairBody: string
    enquire: string
    /** Page-level WhatsApp message. Complete. */
    enquireAll: string
    homeTitle: string
    homeLead: string
    homeCta: string
    finePrint: string[]
    faqTitle: string
    faq: { q: string; a: string }[]
  }
  /**
   * Panda Signage: digital signage and meeting-room displays, self-hosted.
   * No prices, no client list, no screen-brand claims beyond Android 11+.
   */
  signage: {
    /** Header dropdown and footer label. */
    navLabel: string
    sectionEyebrows: { capabilities: string; setup: string; process: string; related: string }
    eyebrow: string
    title: string
    lead: string
    metaTitle: string
    metaDescription: string
    whoTitle: string
    audiences: string[]
    groupsTitle: string
    groups: { id: string; title: string; body: string; items: string[] }[]
    setupTitle: string
    /** Screens and deployment cards. */
    setup: { id: string; title: string; body: string; items: string[] }[]
    processTitle: string
    steps: { title: string; body: string }[]
    priceTitle: string
    priceBody: string
    /** Indicative starting prices, shown as "from S$X". */
    priceLabel: string
    priceFrom: string
    prices: { title: string; body: string; priceSgd: number }[]
    relatedTitle: string
    /** `id` picks the link target: hardware, software or home. */
    related: { id: string; title: string; body: string; cta: string }[]
    enquire: string
    /** Page-level WhatsApp message. Complete. */
    enquireAll: string
    homeTitle: string
    homeLead: string
    homeCta: string
    /** Text drawn inside the hero illustration. */
    art: { headline: string; room: string; status: string; next: string; admin: string; screens: string }
    finePrint: string[]
    faqTitle: string
    faq: { q: string; a: string }[]
  }
  /** Products still in development — shown as "coming next", never as on sale. */
  upcoming: {
    eyebrow: string
    title: string
    lead: string
    status: string
    /** One-line teaser in the strip at the foot of the home page. */
    strip: string
    limitsLabel: string
    items: { id: string; title: string; body: string; bullets: string[]; limits: string }[]
    note: string
    cta: string
  }
  /** "What you receive": the written records of a job, shown as illustrations. */
  deliver: {
    eyebrow: string
    title: string
    lead: string
    items: { id: string; tag: string; title: string; body: string }[]
    demoCta: string
    note: string
  }
  platform: {
    eyebrow: string
    title: string
    lead: string
    points: { title: string; body: string }[]
    protocolsTitle: string
    /** Three short outcomes shown beside the diagram. */
    outcomes: string[]
    /** Device groups on the hub diagram. */
    nodes: string[]
    compatLabel: string
    /** Centre of the protocol diagram — what everything connects into. */
    hubLabel: string
    protocols: { label: string; note: string }[]
  }
  homes: {
    eyebrow: string
    title: string
    lead: string
    items: {
      id: string
      title: string
      subtitle: string
      body: string
      bullets: string[]
      imageAlt: string
    }[]
    /** Service-area block — plain text on purpose, so crawlers and AI answers can quote it. */
    areas: { title: string; lead: string; regions: { name: string; towns: string }[] }
    note: string
  }
  process: {
    eyebrow: string
    title: string
    lead: string
    steps: { title: string; body: string }[]
    note: string
  }
  compatibility: {
    eyebrow: string
    title: string
    lead: string
    groups: { title: string; brands: string[] }[]
    disclaimer: string
  }
  faq: {
    more: string
    eyebrow: string
    title: string
    lead: string
    items: { q: string; a: string }[]
  }
  contact: {
    eyebrow: string
    title: string
    lead: string
    detailsTitle: string
    pendingDetails: string
    pendingDetailsNote: string
    labels: {
      email: string
      phone: string
      whatsapp: string
      address: string
      serviceArea: string
    }
    form: {
      title: string
      name: string
      namePlaceholder: string
      contact: string
      contactPlaceholder: string
      contactHelp: string
      homeType: string
      homeTypeOptions: string[]
      startWith: string
      startWithOptions: string[]
      message: string
      messagePlaceholder: string
      submit: string
      submitViaEmail: string
      submitting: string
      /** Shown under the submit button; "{privacy}" becomes a link labelled privacyLink. */
      consent: string
      privacyLink: string
      viaEmailNote: string
    }
    states: {
      unconfiguredTitle: string
      unconfiguredBody: string
      successTitle: string
      successBody: string
      mailtoTitle: string
      mailtoBody: string
      mailtoFallback: string
      errorTitle: string
      errorBody: string
      required: string
      invalidContact: string
    }
    /** Subject line used when the enquiry is handed to the mail client. */
    mailSubject: string
    whatsappCta: string
    /** Pre-filled first message when a visitor opens WhatsApp from the site. */
    whatsappGreeting: string
    emailCta: string
  }
  cta: {
    title: string
    lead: string
    primary: string
    secondary: string
  }
  /** Articles section: homepage strip, /guides/ index and article pages. */
  guides: {
    eyebrow: string
    title: string
    lead: string
    /** <title> / description of the /guides/ index page. */
    metaTitle: string
    metaDescription: string
    all: string
    updated: string
    /** Visible author line on guides and topic pages: the team, never a person. */
    byline: string
    more: string
    backHome: string
    related: string
    learnMore: string
    pagesTitle: string
    ctaTitle: string
    ctaBody: string
    ctaButton: string
    /** Topic filter labels, keyed by topic id (see TOPICS in content/guides.ts). */
    topics: Record<string, string>
    allTopics: string
    featured: string
    /** "{n}" is replaced by the minutes. */
    readMin: string
    keyPoints: string
    contents: string
    showMore: string
    /** Operator details block on /about/ and /privacy/; rows appear only when configured. */
    companyTitle: string
    companyName: string
    registration: string
  }

  /**
   * /renovation-checklist/: a printable one-page list for the ID and electrician.
   * Every item restates a guide (sources lists them); no new technical claims.
   */
  checklist: {
    metaTitle: string
    metaDescription: string
    eyebrow: string
    title: string
    /** One sentence: who to hand the page to. */
    lead: string
    print: string
    /** Under the button: nothing is saved, tick on paper. */
    printNote: string
    /** Blank write-in fields at the top of the sheet. */
    fields: string[]
    columns: { room: string; control: string; power: string; network: string }
    rows: { room: string; control: string[]; power: string[]; network: string[] }[]
    finalTitle: string
    final: string[]
    /** Short reminders printed under the lists. */
    notes: string[]
    sourcesTitle: string
    sources: { label: string; path: string }[]
  }

  /** Page shown for an unknown address (served with HTTP 404, noindex). */
  notFound: {
    metaTitle: string
    metaDescription: string
    eyebrow: string
    title: string
    lead: string
    linksTitle: string
    home: string
    contact: string
  }

  footer: {
    blurb: string
    navTitle: string
    legalTitle: string
    contactTitle: string
    credits: string
    creditsHref: string
    about: string
    privacy: string
    rights: string
    builtWith: string
    disclaimer: string
    /** Plain statement about the stock photography. */
    imageNote: string
    /** Corner label on every stock photo. */
    imageTag: string
  }
  /**
   * Homepage "plan starter" (components/sections/Planner.tsx): three questions
   * that point at device groups from products.install. Never prices or quantities.
   */
  planner: {
    /** Footer link label. */
    navLabel: string
    eyebrow: string
    title: string
    lead: string
    homeLabel: string
    homes: { id: string; label: string; /** Shown with the result; "{link}" becomes a link to `path` labelled linkLabel. */ note: string; path: string; linkLabel: string }[]
    roomsLabel: string
    rooms: { id: string; label: string }[]
    prioritiesLabel: string
    prioritiesHelp: string
    /** Each priority points at one or more products.install group ids, with the line shown under that group. */
    priorities: { id: string; label: string; picks: { group: string; reason: string }[] }[]
    /** Always listed under the hubs-gateways group. */
    hubReason: string
    submit: string
    incomplete: string
    resultTitle: string
    disclaimer: string
    learnMore: string
    whatsappCta: string
    /** Used when no WhatsApp number is configured: a link to the form below. */
    formCta: string
    /** "{home}", "{rooms}", "{priorities}" are the visitor's choices (labels joined by `join`). Nothing else goes in. */
    message: string
    join: string
  }
  /** Opening WhatsApp line per page (src/lib/whatsapp.ts). Says where the visitor came from, never who they are. */
  whatsapp: {
    /** Guide pages: "{title}" is the guide heading, shortened so the message stays within 200 characters. */
    guide: string
    /** The 404 page. */
    notFound: string
    /** Complete messages keyed by page path ("homes/bto-smart-home/"). Unlisted pages use contact.whatsappGreeting. */
    pages: Record<string, string>
  }
  /** /glossary/ page copy. The terms themselves are in content/glossary.<lang>.ts (loaded only on that page). */
  glossary: {
    navLabel: string
    metaTitle: string
    metaDescription: string
    eyebrow: string
    title: string
    lead: string
    jumpTo: string
    /** Before the 1–2 links under a term. */
    readMore: string
    /** Under every guide: "{link}" becomes a link to the glossary labelled `noteLink`. */
    note: string
    noteLink: string
  }
}

/** One glossary entry: `id` is its stable #anchor; `links` are 1–2 page paths ("guides/what-is-matter/"), labelled with that page's heading. */
export type GlossaryTerm = { id: string; term: string; body: string; links: string[] }
export type Glossary = { groups: { id: string; title: string; terms: GlossaryTerm[] }[] }
