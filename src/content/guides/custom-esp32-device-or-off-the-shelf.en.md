---
title: Custom ESP32 device or off-the-shelf gadget: how to decide
heading: Custom ESP32 device or off-the-shelf: how to decide
description: When a gadget you can buy already does the job, when a custom ESP32 build is worth it, the three levels of custom, and what a prototype is and is not.
published: 2026-11-13
updated: 2026-11-13
points: If a product you can buy does the job and works with your system, buy it | Custom earns its place for a single-purpose screen, your own data, or a device that must join your system without a vendor cloud | A custom build is a prototype or one-off, not a certified product; selling radio devices commercially brings IMDA requirements
---
Most of the time, the right answer is a device you can simply buy. A custom ESP32 device makes sense when nothing on the shelf does the job, when it has to fit into a system you already run without a vendor's cloud in the middle, or when it has to show information no product shows. This guide is a way to tell which situation you are in before you spend money on either.

## When off-the-shelf is enough

Buy the existing product when most of these are true:

- **The job is common.** A smart plug, a temperature sensor or a door sensor has been made many times, cheaply and well.
- **It already works with your setup.** If it supports the platform you use, such as Home Assistant or Matter, there is little left to build.
- **You are happy with its app.** If the manufacturer's app does what you need, a custom interface adds cost without adding much.
- **You need many units, sold or handed out.** A product made in volume has usually been through certification already, and comes with retail support. A custom build has not.

If the only gap is a small one, such as a missing integration or a screen layout you dislike, look at the lowest level of custom below before starting from scratch.

## When a custom device is worth it

A custom build earns its place when the device has one specific job that products do not cover. The kinds of devices we build on ESP32 and ESP32-S3:

- **Touch panels and desk information screens** with an interface designed for one purpose, built with LVGL.
- **Screens that show Singapore data,** such as NEA weather and LTA bus arrivals.
- **Queue number displays and menu screens** for a shop counter.
- **Sensor and automation nodes** that measure or switch: temperature and humidity, presence radar, power metering and relays.
- **Devices that join the system you already run,** through Home Assistant, ESPHome, MQTT or Matter, without a vendor cloud in the middle.
- **AI voice assistant devices** with a persona and knowledge you define. What these can and cannot do is a topic of its own: see [what an ESP32-S3 AI voice assistant can and cannot do](/guides/esp32-ai-voice-assistant-what-it-can-do/).

## Three levels of custom

Custom does not have to mean new hardware. Start at the lowest level that does the job.

1. **New firmware or an interface for an existing device.** Keep the hardware you have and change what it does or how it looks. Indicative price from S$150.
2. **An off-the-shelf board with custom firmware.** A proven development board with firmware written for the job. Indicative price from S$350.
3. **A prototype from scratch.** When nothing existing fits: a prototype designed around the job, tried and revised with you. Indicative price from S$800.

These are indicative starting prices. Parts, enclosure and scope change the total, and the price you pay is written in the quote before work starts.

A rough way to choose: if you already own hardware that almost does it, level one. If a standard board with the right screen or sensor exists, level two. Only when the size, shape or combination of parts cannot be met by anything existing, level three.

## A prototype is not a product

What we build are prototypes and one-off custom builds, not certified mass-produced products. That matters if you plan to sell the device or hand it out in numbers. ESP32 and ESP32-S3 chips have Wi-Fi and Bluetooth built in, so the device has a radio transmitter, and if a device with a radio transmitter is to be sold commercially, IMDA requirements apply. We assess that once you have confirmed how the device will be used.

Going from one working unit to many is its own project: enclosure, testing, certification and supply all come into it. Treat the prototype as the way to find out whether the idea works, not as the finished product.

## How a build runs

1. **Talk it through.** What the device should do, where it will sit and who will use it.
2. **Feasibility and written quote.** We check what is feasible and put the scope and price in writing.
3. **Prototype.** A first working unit, built to the agreed scope.
4. **Try and revise.** You use it, we adjust it. A change of scope is quoted before it is added.
5. **Handover.** The device, the firmware, the source and the documentation are yours.

## What you get at handover

You receive the device, its firmware, the source code and the documentation. There is no lock-in: because you have the source, you are not tied to us for later changes. Support and maintenance terms are written into the quote for each build.

Two things to settle before work starts, because they shape the design:

- **Offline or online.** Sensors, screens and controls can run fully on your local network. Features that call a large language model or an online data source need the internet for that part, and the quote says which parts do.
- **Who pays for AI usage.** If the device uses an AI model, we agree the provider with you, and usage is billed by the provider to your own account, so you can see and control the cost.

## Common questions

### Will you build just one?

Yes. A custom build can be a single device.

### Will it work with my smart home?

Yes, where your system supports it: Home Assistant, ESPHome, MQTT or Matter.

### Can I sell the devices you build for me?

Not as they are. They are prototypes and one-off builds, not certified products, and commercial sale of a device with a radio transmitter needs IMDA compliance. We assess that once the use is confirmed.

### Who owns the firmware?

You do. The firmware, source code and documentation are handed over at the end of the job.

## A simple way to start

Write down what the device should do, where it will sit and who will use it, and note anything you already own that comes close. Then see what [custom hardware](/custom-hardware/) covers. If the device needs a back office, a mini-program or a dashboard around it, [custom software](/software/) can be designed and quoted together with it.

Have a device in mind? [Tell us what it should do](/#contact) and we will tell you honestly whether something off the shelf would do.
