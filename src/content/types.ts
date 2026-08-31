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
    openMenu: string
    closeMenu: string
    homeLink: string
    languageSwitcher: string
  }
  nav: {
    items: NavItem[]
    /** Label for the 3D showroom link. Not a NavItem: those are in-page
     *  anchors, this one leaves the page. */
    showroom: string
    cta: string
  }
  hero: {
    eyebrow: string
    titleLead: string
    titleAccent: string
    lead: string
    primaryCta: string
    secondaryCta: string
    trust: string[]
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
  platform: {
    eyebrow: string
    title: string
    lead: string
    points: { title: string; body: string }[]
    protocolsTitle: string
    /** Centre of the protocol diagram — what everything connects into. */
    hubLabel: string
    protocols: { label: string; note: string }[]
    sourceNote: string
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
    haCaption: string
  }
  faq: {
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
      message: string
      messagePlaceholder: string
      submit: string
      submitViaEmail: string
      submitting: string
      consent: string
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
    emailCta: string
  }
  cta: {
    title: string
    lead: string
    primary: string
    secondary: string
  }
  footer: {
    blurb: string
    navTitle: string
    legalTitle: string
    contactTitle: string
    credits: string
    creditsHref: string
    rights: string
    builtWith: string
    disclaimer: string
  }
}
