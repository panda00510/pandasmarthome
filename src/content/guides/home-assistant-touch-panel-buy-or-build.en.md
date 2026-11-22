---
title: Home Assistant touch panels: buy one or build an ESP32 panel?
heading: Home Assistant touch panels: a tablet, a ready-made panel or an ESP32 panel
description: Three ways to put Home Assistant on the wall or the desk: an old tablet, a ready-made panel or a 4–7 inch ESP32-S3 panel. What each does well and what to check.
published: 2026-11-22
updated: 2026-11-22
points: A tablet shows the full dashboard and cameras, but needs care with power, screen burn-in and its battery | A ready-made panel is quick, but check that it works with Home Assistant locally, not only through its own app | An ESP32-S3 panel with ESPHome and LVGL starts instantly and does a few jobs well; it is not a web browser
---
A touch panel is the part of a smart home that guests and family actually touch. For Home Assistant there are three common choices: an old or cheap tablet running the dashboard, a ready-made panel from a smart home brand, or a small ESP32-S3 panel built for a few jobs. The right one depends on what the panel should show, where it goes and how it gets power.

## Option 1: a tablet running the dashboard

An Android tablet or an old iPad can open the Home Assistant app or a browser in full-screen mode, so it shows the same dashboard as your phone.

- **Good at:** the full dashboard, camera views, maps, media controls, anything a web page can show.
- **Watch for:** a tablet that stays plugged in day and night wears its battery, and some batteries swell. Check the tablet's charging options, or use a smart plug to charge it in cycles.
- **Also:** the screen can stay on all day, so set it to dim or turn off when nobody is in front of it. Tablets also need app and system updates.
- **Mounting:** a wall bracket and a power point behind it look tidy; a cable down the wall does not.

## Option 2: a ready-made wall panel

Several smart home brands sell panels that fit in a wall box and replace a switch, or sit on a stand. Some run Android, some are simpler scene panels.

They look finished, stay in one place on the wall and often have physical buttons for lights. Check four things before buying:

- **Home Assistant:** does it work with Home Assistant directly on your home network, or only through the brand's own app and cloud?
- **Protocol:** Wi-Fi, Zigbee or Matter.
- **Wall box:** does it fit the box behind it? Panels are often made for one box size.
- **Power:** a panel that replaces a switch needs wiring, which is work for a licensed electrician.

Our guide on [local control versus Google, Apple and SmartThings](/guides/local-smart-home-vs-google-apple-smartthings/) explains why the "works locally" question matters.

## Option 3: an ESP32-S3 panel with ESPHome and LVGL

An ESP32-S3 is a small, low-power chip with Wi-Fi. Paired with a 4–7 inch touchscreen, it runs ESPHome (open-source firmware that connects devices to Home Assistant) and LVGL (a library for drawing touch screens on small chips).

What it does well:

- It starts in seconds and stays on, with no app or browser to crash.
- Big, simple buttons for the few things people actually do: lights, aircon, curtains, a scene.
- It talks to Home Assistant on your home network, so it keeps working when the internet is down.
- It uses little power, so a USB-C supply is enough.

What it does not do:

- It is not a web browser, so it cannot show the Home Assistant dashboard itself. Each screen is designed for the panel.
- Live camera video is not what it is for.
- The screen is small; for a big wall display, use a tablet.

A panel like this can also show information that is not a control, such as the weather or the next bus. Our own [touch panel](/products/) is an ESP32-S3 panel of this kind, and we [build custom panels](/custom-hardware/) with a layout designed around a home or a shop.

## Which one to choose

- **Full dashboard and cameras on the wall:** a tablet.
- **Replaces a switch and looks built in:** a ready-made panel that works with Home Assistant locally.
- **A few large buttons that always work, on a desk or by a door:** an ESP32-S3 panel.

Many homes end up with more than one: a tablet in the living room and small panels by the bedroom doors.

## Plan the power and the network

Wherever the panel goes, it needs power and a good Wi-Fi signal. During renovation, ask for a power point (or a network point) behind each planned panel, so there is no cable on the wall later. See the [renovation preparation guide](/guides/renovation-smart-home-prep/) and, for a home over several floors, [network planning for a landed home](/guides/landed-home-network-multi-floor/).

## Common questions

### Can a touch panel replace my light switches?

A panel can control lights, but keep a physical switch or button for each room. Guests, helpers and anyone half-asleep reach for a switch, not a screen. See our [home controls](/solutions/home-control/) page.

### Does an ESP32 panel need the internet?

No. It talks to Home Assistant over your home network. Information from outside, such as the weather, needs the internet, but the buttons do not.

### What size screen do I need?

For a few buttons by a door or on a desk, 4–7 inches is enough. For a full dashboard with cameras, a tablet of 8 inches or more is easier to use.

### Can I build an ESP32 panel myself?

Yes. ESPHome and LVGL are open source and well documented. Building one takes time to design the screens and a case; that is what a custom build saves. Our guide on [a custom device or an off-the-shelf one](/guides/custom-esp32-device-or-off-the-shelf/) helps with the choice.

## Start with what people press

Write down the three or four things people do most often in that spot. That list decides the panel more than the screen size does.

Want a panel for your home? [Tell us where it goes and what it should control](/#contact), and we will suggest which kind fits.
