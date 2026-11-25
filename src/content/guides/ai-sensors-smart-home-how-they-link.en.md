---
title: How AI hardware and sensors work together in a smart home — from detection to action
heading: How AI hardware and sensors work together
description: A plain explanation of how a sensor, an AI edge device and a controller turn something noticed in a room into an action, which parts run locally, and where the limits are.
published: 2026-11-25
updated: 2026-11-25
draft: true
points: A sensor notices, an AI device interprets, a controller acts | Keep the decision on a local controller so it works without internet | Start with one room and one reliable trigger
---
"AI" in a smart home is often described as if it were one product. In practice it is a chain of three small jobs, and it helps to know which link does what. Once you can see the chain, it is easier to judge a claim, plan a room and know what to test.

## The chain: notice, interpret, act

1. **Notice.** A sensor measures something: movement, presence, a door opening, humidity, air quality, a person in a camera picture.
2. **Interpret.** Software decides what the reading means. A simple sensor does this in a few lines of logic, such as "no movement for ten minutes". An AI device does it with a trained model, such as "this is a person, not a branch moving in the wind".
3. **Act.** A controller applies a rule and sends a command: a light, an aircon, a lock, a notification.

Most disappointments come from one weak link. A good AI model fed by a badly placed sensor still gives poor results, and a good sensor with a rule that is too eager still switches things off while someone is sitting still.

## Where AI hardware actually helps

AI is useful where a simple threshold cannot tell the difference between two situations.

- **Telling a person from other movement.** A camera with analytics, or a radar sensor, can ignore pets, fans and curtains that confuse a basic motion sensor. See [adding AI to your existing CCTV](/guides/ai-upgrade-existing-cctv/).
- **Presence rather than movement.** A radar sensor can notice someone sitting still, which a basic motion sensor cannot. See [radar or motion sensor: which room gets which](/guides/presence-sensor-radar-vs-motion-pir/).
- **Falls and unusual stillness.** Radar can notice a sudden drop in height without recording a picture. See [fall detection without a camera](/guides/radar-fall-detection/).
- **Counting and zones.** An edge box can count people crossing a line or entering an area.

For a plain open-or-closed question, such as whether a door is open, a simple contact sensor is better than any AI. It is cheaper to run, easier to trust and has nothing to misread.

## What runs where

Each link can run in your home or in someone else's data centre. The choice affects privacy, speed and what happens when the internet is down.

- **Sensors** report to a hub or controller in your home, usually over Zigbee, Thread or Wi-Fi. See [Zigbee, Thread and Wi-Fi: which for what](/guides/zigbee-thread-wifi-which-for-what/).
- **AI interpretation** can run on an edge device in your home or in a cloud service. Ask the supplier which one, and what happens to the pictures or readings.
- **The rule and the action** should run on a controller in your home, so a light still comes on when the internet is down. See [what still works without internet](/guides/smart-home-without-internet/).

## Linking them: a few patterns that work

- **Approach to the front door.** A camera or radar detects a person on the path, and the porch light comes on and a notification is sent.
- **Empty room, aircon off.** A presence sensor reports no one for a set time, then the aircon switches off. A door or window sensor can pause it while a window is open. See [smart aircon control](/guides/smart-aircon-control/).
- **Bathroom at night.** A presence sensor turns on a dim path light, and sends an alert if there has been no movement for an unusually long time.
- **Away from home.** A sensor that sees movement while the home should be empty sends an alert that you actually look at. See [holiday mode](/guides/holiday-mode-away-from-home/).

## Be honest about the limits

- **No sensor is perfect.** There will be false alarms and missed events. Expect to adjust the placement and the settings after installation.
- **Accuracy figures are usually the vendor's own.** Ask how they were measured, in what room and with what lighting.
- **Presence data is personal data.** Even a sensor that records no picture can tell when someone is home. Keep it on your own system and limit who can see it. See [smart home privacy](/guides/smart-home-privacy-local-vs-cloud/).
- **Life safety stays separate.** A smoke alarm or a personal alarm should not depend on a smart home rule.

## Common questions

### Do I need an AI device for a smart home?

No. Many useful automations need only simple sensors and a controller. AI is worth adding where a simple sensor keeps getting it wrong, such as telling a person from a pet.

### Does AI hardware send my pictures to the cloud?

It depends on the product. Some process pictures on a device in your home and send only a result, such as "person detected". Others upload video. Ask the supplier directly, and check what still works if the internet goes down.

### Can sensors from different brands work together?

Often yes, if they use a common standard such as Zigbee, Thread or Matter, or if the controller supports each brand. Check before buying rather than after. See [what is Matter](/guides/what-is-matter/).

### Which sensor should I start with?

Start with one room and one problem. A presence sensor in a bathroom or a corridor is a common first choice, because the benefit is easy to see.

## A simple way to start

Pick one room and one annoyance, such as a light that stays off when you are sitting still. Fit one sensor, write one rule, and watch it for a couple of weeks before adding more.

Not sure which sensors suit your home? [Tell us about the rooms](/#contact) and we will suggest where to start and what to test first. See also [lighting and presence control](/solutions/smart-lighting/).
