import type { Glossary } from './types'

/**
 * /glossary/ terms (English). Each definition restates what our guides already
 * say; the links point to where it is explained in full. Loaded only on the
 * glossary page (src/views.ts). Keep ids identical in glossary.zh.ts.
 */
const g = (slug: string) => `guides/${slug}/`

export const glossary: Glossary = {
  groups: [
    {
      id: 'protocols',
      title: 'Protocols and standards',
      terms: [
        {
          id: 'matter',
          term: 'Matter',
          body: 'An open standard for how smart home devices talk to each other and to the apps and hubs that control them. A Matter device can be added to any Matter-compatible platform, not only its maker’s app. It describes the language, not the radio: Matter runs over Wi-Fi, Thread or Ethernet.',
          links: [g('what-is-matter'), g('local-smart-home-vs-google-apple-smartthings')],
        },
        {
          id: 'thread',
          term: 'Thread',
          body: 'A low-power mesh network, well suited to battery sensors, locks and blinds, and one of the links Matter can run over. Thread devices need a Thread border router on your network; some smart speakers, media boxes and hubs have one built in, so check before you buy.',
          links: [g('what-is-matter')],
        },
        {
          id: 'zigbee',
          term: 'Zigbee',
          body: 'A low-power wireless mesh used by many sensors, switches and curtain motors. Zigbee devices connect to a hub instead of your Wi-Fi, so only the hub needs a network connection, and mains-powered devices help strengthen the mesh. Working Zigbee devices need not be replaced when you move to Matter.',
          links: [g('wifi-for-smart-home'), g('what-is-matter')],
        },
        {
          id: 'wifi',
          term: 'Wi-Fi',
          body: 'The home network your phone and laptop already use; many plugs, bulbs and cameras join it directly. Many smart devices are 2.4 GHz only, and dozens of them ask more of a router than a few phones do, so coverage is worth planning.',
          links: [g('wifi-for-smart-home')],
        },
        {
          id: 'bluetooth-le',
          term: 'Bluetooth LE',
          body: 'Bluetooth Low Energy: a short-range, low-power radio built into phones and many small devices, including ESP32 chips. Some smart locks use it to unlock from a phone app, which is convenient but depends on your phone’s battery and the app working.',
          links: [g('smart-door-lock-guide'), g('esp32-ai-voice-assistant-what-it-can-do')],
        },
        {
          id: 'infrared',
          term: 'Infrared (IR)',
          body: 'The invisible signal a TV or aircon remote sends. A smart IR controller learns or already knows those signals and, placed where it can see the indoor unit, sends commands from an app, a schedule or an automation, with no rewiring.',
          links: [g('smart-aircon-control'), g('smart-home-for-renters')],
        },
        {
          id: 'mqtt',
          term: 'MQTT',
          body: 'A lightweight messaging protocol: devices publish readings and receive commands through a message broker on your own network. It is one of the ways a custom device can join the system you already run, alongside Home Assistant, ESPHome and Matter, without a vendor cloud in the middle.',
          links: [g('custom-esp32-device-or-off-the-shelf'), 'custom-hardware/'],
        },
      ],
    },
    {
      id: 'system',
      title: 'Systems and control',
      terms: [
        {
          id: 'local-control',
          term: 'Local control',
          body: 'A hub or controller on your own network makes the decisions, rather than a vendor’s server. Wall switches, scene buttons, automations and sensors keep working when the internet drops, and less data leaves the house. If a device’s maker offers no local control, no platform can add it.',
          links: [g('smart-home-without-internet'), g('local-smart-home-vs-google-apple-smartthings')],
        },
        {
          id: 'cloud',
          term: 'Cloud',
          body: 'The vendor’s servers on the internet. Cloud-first platforms and apps are usually easier to start with, but remote access, most voice assistants and cloud-only devices pause during an internet outage, and a service can change its terms or pricing.',
          links: [g('smart-home-privacy-local-vs-cloud'), g('local-smart-home-vs-google-apple-smartthings')],
        },
        {
          id: 'hub',
          term: 'Hub / gateway',
          body: 'A small box on your network that devices such as Zigbee or Thread sensors connect to, so only the hub needs a network connection. A local hub or controller lets automations run without the internet. Plan a power point and a network cable where it will sit.',
          links: [g('wifi-for-smart-home'), g('bto-key-collection-smart-home-timeline')],
        },
        {
          id: 'home-assistant',
          term: 'Home Assistant',
          body: 'A widely used open-source smart home platform that runs on hardware in your home. It connects devices from many makers in one place, with automations and dashboards that work on your local network, but it asks for more setup and care than a cloud app.',
          links: [g('local-smart-home-vs-google-apple-smartthings'), g('custom-esp32-device-or-off-the-shelf')],
        },
        {
          id: 'esphome',
          term: 'ESPHome',
          body: 'Open-source firmware for ESP32 and similar chips, set up from a configuration file, that lets a device join Home Assistant directly without a vendor cloud. Our desk touch panel runs ESPHome.',
          links: [g('custom-esp32-device-or-off-the-shelf'), 'products/'],
        },
        {
          id: 'scene',
          term: 'Scene',
          body: 'A saved set of states applied together with one command, such as dimming the lights and closing the curtains for a film. A wireless scene button by the door or the bed lets people who never open the app use it with one press.',
          links: ['solutions/smart-lighting/', 'solutions/home-control/'],
        },
        {
          id: 'automation',
          term: 'Automation',
          body: 'A rule the system runs by itself: when something happens (a time, a sensor reading, a door opening), do something, such as a notification when humidity in a wardrobe stays high. On a local system automations run on the controller in your home, so they keep working when the internet is down.',
          links: [g('singapore-humidity-mould-aircon-dry-mode-automation'), g('reduce-aircon-electricity-smart-home')],
        },
        {
          id: 'dashboard',
          term: 'Dashboard',
          body: 'The screen of controls on a phone, tablet or wall panel. A good one shows the rooms and controls you actually use, not every device in the house; on a local platform it works on your home network without the internet.',
          links: ['solutions/home-control/', g('local-smart-home-vs-google-apple-smartthings')],
        },
      ],
    },
    {
      id: 'electrical',
      title: 'Wiring and installation',
      terms: [
        {
          id: 'neutral-wire',
          term: 'Neutral wire',
          body: 'The wire that completes the circuit back from a light. Many smart switches need a neutral in the switch box to power themselves, but in many older homes the neutral goes straight to the light fitting and the box holds only the live and switched wires. Open a switch box, ideally with your electrician, to check.',
          links: [g('no-neutral-smart-switches'), g('check-older-home-before-smart')],
        },
        {
          id: 'no-neutral-switch',
          term: 'No-neutral switch',
          body: 'A smart switch that powers itself by passing a very small current through the light, even when it is off. It works where the switch box has no neutral, but low-wattage LEDs can flicker or glow faintly; a bypass capacitor at the light is a common fix. There are fewer models to choose from.',
          links: [g('no-neutral-smart-switches')],
        },
        {
          id: 'dimmer',
          term: 'Dimmer',
          body: 'Replaces the wall switch and lets you set the brightness instead of only on and off. The bulb or LED driver has to work with that dimmer, so check the instructions for both before you buy.',
          links: [g('smart-switch-or-smart-bulb'), 'solutions/smart-lighting/'],
        },
        {
          id: 'switch-box',
          term: 'Switch box',
          body: 'The box in the wall behind a light switch, also called a back box. Its wiring, above all whether there is a neutral, decides which smart switches can go in, so settle neutral wires, back boxes and switch positions before renovation closes the walls.',
          links: [g('bto-key-collection-smart-home-timeline'), g('no-neutral-smart-switches')],
        },
        {
          id: 'distribution-board',
          term: 'Distribution board (DB)',
          body: 'The board where your home’s circuits and their breakers start. Circuit or whole-home energy meters are installed inside it, which is work for a licensed electrician, and its condition is worth checking before adding devices that touch the wiring.',
          links: [g('reduce-aircon-electricity-smart-home'), g('check-older-home-before-smart')],
        },
        {
          id: 'licensed-electrical-worker',
          term: 'Licensed electrical worker',
          body: 'In Singapore, new circuits, wiring in walls, switch boxes and the distribution board are work for a licensed electrical worker. Battery sensors, smart plugs and infrared aircon control avoid most of that work.',
          links: [g('check-older-home-before-smart'), g('smart-home-during-hdb-renovation')],
        },
        {
          id: 'curtain-box',
          term: 'Curtain box',
          body: 'The box or pelmet above a window that hides the curtain track, usually built by the carpenter. Check that it is deep enough for the motor, and for two tracks if you want sheer and blackout layers, and plan a power point next to it for wired motors.',
          links: [g('motorised-curtains-guide'), g('bto-key-collection-smart-home-timeline')],
        },
        {
          id: 'access-point',
          term: 'Access point',
          body: 'A device that spreads Wi-Fi from a fixed spot, linked back to the router. Access points connected by network cable are usually more dependable than wireless mesh nodes, where each wireless hop costs some performance.',
          links: [g('wifi-for-smart-home')],
        },
        {
          id: 'lan-cable',
          term: 'LAN / Ethernet cable',
          body: 'A network cable run through the walls to a room. A LAN run to the living room, study and wherever an access point, hub or TV will sit is much more reliable than relying on Wi-Fi alone, and it is easiest before carpentry and false ceilings go up.',
          links: [g('renovation-smart-home-prep'), g('bto-key-collection-smart-home-timeline')],
        },
      ],
    },
    {
      id: 'devices',
      title: 'Devices',
      terms: [
        {
          id: 'presence-radar',
          term: 'Presence radar',
          body: 'A sensor that uses low-power radio waves to tell where a person is and how they move, and in some models whether they have fallen, without a camera or microphone. Radar does not depend on light, so a dark room is no problem. False alarms and missed falls both happen: treat it as a safety aid, not a medical device.',
          links: [g('radar-fall-detection'), g('smart-home-for-elderly-parents')],
        },
        {
          id: 'contact-sensor',
          term: 'Door / window contact sensor',
          body: 'A small sensor on a door or window that reports when it opens or closes. On a front door it can show whether the door was opened late at night, or has not opened by the usual time in the morning, without any camera.',
          links: [g('smart-home-for-elderly-parents'), g('renovation-smart-home-prep')],
        },
        {
          id: 'leak-sensor',
          term: 'Water leak sensor',
          body: 'Sits on the floor and raises an alert when it gets wet: under the kitchen sink, by the washing machine or under an aircon drain. Some connect to a controller over Zigbee or another low-power link; some are Wi-Fi only.',
          links: [g('water-smoke-humidity-sensors-singapore'), g('singapore-humidity-mould-aircon-dry-mode-automation')],
        },
        {
          id: 'smart-plug',
          term: 'Smart plug',
          body: 'An adapter between the socket and a plug-in appliance that switches it from an app or an automation; some also measure what that appliance uses. It suits lamps, fans or a dehumidifier, not a wired-in aircon, and it cannot press the button on an appliance that comes back on in standby.',
          links: [g('reduce-aircon-electricity-smart-home'), g('smart-home-for-renters')],
        },
        {
          id: 'digital-lock',
          term: 'Digital lock',
          body: 'A door lock opened by fingerprint, PIN or phone as well as a key. Retrofit locks fit over the existing lock; full replacements modify the door. Check the low-battery warning and the mechanical key override, and make sure anyone inside can always open the door quickly without a code, key or phone.',
          links: [g('smart-door-lock-guide'), g('smart-home-helpers-kids-guests-access')],
        },
        {
          id: 'video-doorbell',
          term: 'Video doorbell',
          body: 'A doorbell with a camera that lets you see and answer whoever is at the door from your phone. It captures images and sound of the people who come to your door, so decide where recordings are kept, and if it keeps a log of entries, tell the people it affects.',
          links: [g('smart-home-privacy-local-vs-cloud'), g('smart-home-helpers-kids-guests-access')],
        },
      ],
    },
    {
      id: 'singapore',
      title: 'Singapore homes',
      terms: [
        {
          id: 'hdb',
          term: 'HDB',
          body: 'The Housing & Development Board, Singapore’s public housing authority, and the flats it builds. HDB publishes renovation guidelines for flats, and some works need an HDB permit before they start.',
          links: [g('smart-home-during-hdb-renovation'), 'homes/hdb-resale-smart-home/'],
        },
        {
          id: 'bto',
          term: 'BTO',
          body: 'Build-To-Order: a new HDB flat bought before it is built. After key collection the order matters more than the shopping list: settle switch positions, neutral wires and LAN runs before carpentry and false ceilings.',
          links: [g('bto-key-collection-smart-home-timeline'), 'homes/bto-smart-home/'],
        },
        {
          id: 'resale-flat',
          term: 'Resale flat',
          body: 'An HDB flat bought from its previous owner rather than new. Its switch boxes, wiring and aircon may be older than the apps that control them, so ask the electrical worker to check the existing wiring before new work is added.',
          links: ['homes/hdb-resale-smart-home/', g('check-older-home-before-smart')],
        },
        {
          id: 'condo-mcst',
          term: 'Condo and MCST',
          body: 'A condominium is a private apartment development; its management corporation (MCST) runs the estate and sets renovation rules. Fixed wiring, door changes and anything touching the facade may be covered by those rules, so share them with your installer from the start.',
          links: [g('condo-smart-home-upgrade-cost-factors'), 'homes/condo-smart-home/'],
        },
        {
          id: 'landed',
          term: 'Landed home',
          body: 'A house on its own plot, such as a terrace, semi-detached house or bungalow. The first problem is rarely automation but coverage: a signal that reaches every floor, and a gate and perimeter that need watching.',
          links: ['homes/landed-smart-home/', g('wifi-for-smart-home')],
        },
        {
          id: 'interior-designer',
          term: 'ID (interior designer)',
          body: 'In Singapore “ID” usually means your interior designer, who often coordinates the renovation trades and sets the schedule. Tell your ID early that you want a smart home, so wiring, curtain boxes and network cables are planned before carpentry.',
          links: [g('bto-key-collection-smart-home-timeline'), g('smart-home-during-hdb-renovation')],
        },
      ],
    },
    {
      id: 'business',
      title: 'Our hardware and signage',
      terms: [
        {
          id: 'esp32',
          term: 'ESP32',
          body: 'A family of low-cost microcontrollers, small chips that run one program, with Wi-Fi and Bluetooth LE built in. We build custom voice assistants, touch panels, sensors and relays on ESP32 and ESP32-S3. Because it has a radio transmitter, a device sold commercially has to meet IMDA requirements.',
          links: [g('custom-esp32-device-or-off-the-shelf'), g('esp32-ai-voice-assistant-what-it-can-do')],
        },
        {
          id: 'lvgl',
          term: 'LVGL',
          body: 'An open-source graphics library for touch interfaces on small screens driven by a microcontroller. Our touch panels and desk information screens are built with LVGL, with an interface designed for one purpose.',
          links: ['custom-hardware/', 'products/'],
        },
        {
          id: 'digital-signage',
          term: 'Digital signage',
          body: 'Screens that show a menu, notices, a welcome message or the day’s meetings. A setup is a screen, a player, a way to manage the content and a person who keeps it current; content cached on the player keeps playing when the network drops. Panda Signage is self-hosted.',
          links: [g('digital-signage-small-office-shop-singapore'), 'signage/'],
        },
        {
          id: 'room-panel',
          term: 'Meeting room door panel',
          body: 'A small screen beside a meeting room door that shows whether the room is free and what is booked next. In Panda Signage, bookings entered in the console appear on the door panel and on room list screens.',
          links: ['signage/', g('digital-signage-small-office-shop-singapore')],
        },
      ],
    },
  ],
}
