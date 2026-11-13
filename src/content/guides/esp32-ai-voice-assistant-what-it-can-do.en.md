---
title: What an ESP32-S3 AI voice assistant can and cannot do
description: An ESP32-S3 voice assistant handles the wake word, audio and screen; the AI answer usually comes from a server. What it does well and its limits.
published: 2026-11-13
updated: 2026-11-13
points: The device listens, plays and displays; speech recognition and the AI answer usually run on a server | Quality, speed and privacy depend on which server you choose, so pick it and tell people | It can control Home Assistant, but it is not a phone, a speaker upgrade or an emergency device
---
An ESP32-S3 AI voice assistant is a small, low-cost device that listens for a wake word, records your question and plays back the answer. The "thinking" part, turning speech into text and producing a reply, usually happens on a server, either a cloud service or a computer on your own network. So it needs a network, and it is only as good as the service behind it.

## What the ESP32-S3 is

The ESP32-S3 is a low-cost microcontroller, a small chip that runs one program, with Wi-Fi and Bluetooth LE built in. It is not a computer like a phone. It is good at handling buttons, sensors, a small screen, a microphone and a speaker, and at talking to other devices over the network. It is not designed to run a large AI model on its own.

## What happens on the device

- **Wake word:** listening for a short trigger phrase so it knows when you are talking to it.
- **Audio:** capturing your voice through the microphone and playing the reply through the speaker.
- **Screen:** showing status, text or expressions, if the device has a display.
- **Buttons and sensors:** a push-to-talk button, a temperature sensor or similar inputs.
- **Network:** connecting over Wi-Fi to the server that does the heavy lifting.

## What happens on the server

After the wake word, the device sends your audio to a server. The server turns speech into text, passes the text to a language model (the AI that writes the answer), and turns the answer back into speech. That server can be:

- **A cloud service** run by an AI provider. Easy to start, and it needs the internet.
- **A local server** on your own network, such as a small computer at home or in the office. More setup, and more of the audio stays on your premises.

Because the device depends on this link, a slow or patchy network shows up as a slow or patchy assistant. See [Wi-Fi for a smart home](/guides/wifi-for-smart-home/) for getting coverage right, and [what still works without internet](/guides/smart-home-without-internet/) for the wider picture.

## Speed and privacy are trade-offs

Every question makes a round trip to the server. How quick it feels depends on your network, the server and the AI model you pick. A larger model may give better answers and take longer.

Privacy follows the same path. **Your voice goes to whichever server is configured.** Choose that server deliberately, read its privacy terms, and tell the people who use or are near the device, including staff, customers or a domestic helper. Our guide to [smart home privacy](/guides/smart-home-privacy-local-vs-cloud/) covers the questions to ask.

## Controlling your smart home

With the right integration, the assistant can pass commands to a smart home system such as Home Assistant: turn on the lights, close the curtains, ask whether the door is locked. If you are still choosing a platform, read [local control versus Google, Apple and SmartThings](/guides/local-smart-home-vs-google-apple-smartthings/).

## Open-source firmware

You do not have to start from nothing. There are open-source firmware projects for ESP32 voice assistants; "xiaozhi" (小智) is one example. Open-source code can be inspected and adapted, so a custom device is not locked to one company's app.

## What it cannot do

- **It is not a phone or a premium smart speaker.** The microphone and speaker are small, and the audio quality reflects that.
- **It is not a medical or emergency device.** Do not rely on it to call for help. For older family members, see [smart home for elderly parents](/guides/smart-home-for-elderly-parents/).
- **It has limited intelligence of its own.** Without the server, it can do little beyond the wake word and basic device functions.
- **It needs maintenance.** Firmware, server software and AI service settings need updates over time, and a cloud service can change its terms or pricing.

## Common questions

### Does it work without the internet?

Only if the speech and AI processing runs on a local server on your network. With a cloud service, no internet means no answers.

### Is my voice recorded?

Your audio is sent to the configured server for processing. Whether it is stored, and for how long, depends on that server or service, so check its terms and settings before you use it.

### Can it speak Chinese and English?

That depends on the speech and AI services it is connected to. Many support several languages, so check the specific services you plan to use.

### Is it a good fit for a shop or office?

It can be, for tasks like answering simple questions or controlling the room. Tell staff and customers that a voice assistant is present and where the audio goes.

## A simple way to start

Decide what you want it to do, which server it should talk to, and who will be near it. See our [ESP32 custom hardware](/custom-hardware/) and [products](/products/), or [custom software](/software/) if you need a server side as well.

Have an idea for a voice device? [Tell us what you want it to do](/#contact) and we will tell you honestly what is practical.
