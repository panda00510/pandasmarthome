---
title: Using an AI camera or edge box as a sensor — events that can trigger lights, locks and alerts
heading: An AI camera as a sensor: events that trigger actions
description: How a person, vehicle or package event from an AI camera or edge box can drive lights, alerts and door actions, how to avoid false triggers, and which actions should never be automatic.
published: 2026-11-25
updated: 2026-11-25
draft: true
points: Treat the camera as a sensor that reports events, not as a live feed | Send events to a local controller and keep video on site | Never let a camera event unlock a door by itself
---
An AI camera, or an edge box reading your existing cameras, can report short events: a person at the gate, a vehicle in the car porch, a parcel at the door. Those events are useful as triggers for the rest of the home. They also need care, because a camera watches people.

## From picture to event

The AI device watches the video and, when it recognises something, sends a short message to your controller: what it saw, where and when. The controller then applies a rule. Only the message needs to travel. The video can stay on the device. See [adding AI to your existing CCTV](/guides/ai-upgrade-existing-cctv/) for how an edge box fits with cameras you already have.

## Events worth using

- **Person detected in a zone.** The most useful event, as long as the zone is drawn carefully, for example the path to your door and not the public street.
- **Vehicle or package.** A vehicle in the car porch, or a parcel left at the door.
- **A line is crossed.** Someone enters a gate or a side lane.
- **No person where one is expected.** A daily check, such as a sign of life in a parent's kitchen in the morning, but see the privacy points below before you use it.

## Actions that suit an event

1. **Light on.** The porch or path light comes on when a person is detected after dark.
2. **Notification.** A message that names the camera and zone, so you can tell a front door event from the back gate.
3. **Combine with another sensor.** A person at the door, plus a door that opens, is a more reliable sign than either alone.
4. **Record or flag a clip.** The event marks the moment in the recording, so you do not scroll through hours.
5. **A quiet mode.** At night or when you are home, send nothing, or send a low-priority notice.

## Actions that should not be automatic

- **Do not let a camera event unlock a door.** A picture can be wrong, and a photo or a screen can fool some systems. An unlock should need a deliberate action by an authorised person. See [smart door lock guide](/guides/smart-door-lock-guide/).
- **Do not make life-safety actions depend on a camera.** Smoke or gas alarms should work on their own.
- **Do not treat a recognised face as proof of identity.** Even where a product offers face recognition, it is a convenience at best, and it involves very sensitive personal data.

## Reducing false triggers

- **Draw the zone tightly.** Cover your own path, not the neighbour's door or the public road.
- **Choose the event type.** Person events are usually more useful than general motion, which fires for branches, shadows and rain.
- **Set a cool-down.** One event, then a minute of silence, so a delivery does not send ten notifications.
- **Mind the light and angle.** A camera pointing into a bright background or mounted very high gives the software less to work with.
- **Test at night and in the rain,** because that is when it matters.

## Privacy comes first

A camera that triggers actions is still a camera. In Singapore, organisations that use CCTV have duties under the PDPA, including telling people why footage is collected, and a home that records beyond its own boundary can affect neighbours and passers-by. If you run a business, check the guidance from the Personal Data Protection Commission and put clear notices in place. In a home, aim cameras at your own entrance, not at a neighbour's door, and tell household members, including a helper, what is recorded and who can see it. See [smart home privacy](/guides/smart-home-privacy-local-vs-cloud/) and [who gets access to what](/guides/smart-home-helpers-kids-guests-access/).

## Common questions

### Can a camera event turn on a light?

Yes. Send the person-detected event to a local controller and let a rule switch the light. It works best when the controller is in your home, so it does not depend on the internet.

### Does the video have to leave my home?

Not necessarily. If the analysis runs on a device in your home, only a short event message needs to reach the controller. Ask any supplier where the analysis runs.

### Should a camera open my door when it sees me?

We would advise against it. A picture can be wrong, and an unlock should need a deliberate action. A keypad, a card, a phone or a key is a better trigger.

### Do I need to tell people I have a camera?

If you use CCTV for a business, yes: the PDPA expects clear notice. At home, tell the people who live there and anyone who visits regularly, and avoid recording neighbours. Check the Personal Data Protection Commission guidance for your situation.

## A simple way to start

Pick one camera and one zone, such as the path to your front door. Send person events to the porch light and your phone, tune the zone and the cool-down for two weeks, then decide whether to add more.

Want to know whether your existing cameras can report events like these? [Tell us the brand and model](/#contact) and we will check what they support before suggesting anything. See also [control surfaces for the whole household](/solutions/home-control/).
