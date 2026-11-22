---
title: Looking after a home controller: backups, updates and failures
heading: Looking after your smart home controller — backups, updates and what if it fails
description: A local smart home runs on one controller in your home. How to back it up, when to update it, and how to recover if the hardware fails.
published: 2026-11-22
updated: 2026-11-22
points: Back up the controller automatically, and keep a copy somewhere other than the controller itself | Update on purpose: take a backup, read the release notes, then update, rather than on the day a release comes out | If the hardware fails, a recent backup restores the setup onto new hardware; Zigbee and Thread radios need extra care
---
A local smart home keeps working when the internet is down because the automations run on a controller in your home, often running Home Assistant. That also means the controller is yours to look after. It needs little attention, but three habits matter: backups, careful updates, and a plan for when the hardware fails.

## Backups: automatic, and kept somewhere else

Home Assistant has backups built in. A backup holds the configuration, the automations, the dashboards, the add-ons and, if you include it, the history.

- **Schedule them.** Set automatic backups, for example daily, and keep several so you can go back more than one day.
- **Keep a copy off the controller.** A backup that only lives on the controller is lost with it. Copy it to a network drive, another computer or a cloud storage service you choose.
- **Keep the key safe.** If your backups are encrypted, store the encryption key somewhere other than the controller, such as a password manager. Without it, the backup cannot be restored.
- **Check one now and then.** Open the backup list and see that recent backups exist and have a sensible size.

## Updates: on purpose, not on release day

Home Assistant releases a new version every month, with smaller fixes in between. Add-ons and the operating system update separately.

- **Take a backup first.** Most update screens offer to do this; let them.
- **Read the release notes** for anything marked as a breaking change that affects a device or integration you use.
- **There is no need to update on day one.** Waiting a little lets early fixes arrive. But do not stay years behind either: security fixes and support for newer devices come with updates.
- **Update when you are home,** so you can check that lights, locks and the aircon still respond.

Device firmware, such as for switches, sensors and ESPHome devices, is a separate update. Treat it the same way: one at a time, and only when there is a reason.

## When the hardware fails

Controllers are small computers, and small computers fail. Storage wears out, power supplies die, and a sudden power cut can damage a running system.

- **Prefer solid storage.** A controller that runs from a memory card is more likely to fail than one with an SSD.
- **Protect the power.** A small UPS keeps the controller, the router and the network running through a short power cut. See [network planning for a landed home](/guides/landed-home-network-multi-floor/).
- **Restore from a backup.** On new hardware, a fresh Home Assistant install offers to restore from a backup. With a recent backup, the home comes back with its automations and dashboards.
- **Mind the Zigbee and Thread radio.** These networks depend partly on the radio stick or module. Moving the same stick to the new controller is simplest. Replacing it with a different one may need a migration step, and some devices may need pairing again.

While the controller is down, wall switches that control their own circuit still work by hand. Automations, schedules and dashboards stop until it is back. See [what still works without internet](/guides/smart-home-without-internet/).

## Who looks after it

You can look after the controller yourself: at handover you receive the administrator credentials and documentation, so nothing depends on us. Some households prefer a support arrangement instead, which is always stated separately from the installation. Either way, write down where the backups go and who checks them.

## Common questions

### What happens if the controller breaks?

Automations and dashboards stop, but switches that control their own circuit keep working by hand. With a recent backup kept off the controller, the setup can be restored onto new hardware.

### Do I have to install every update?

No. Update on purpose: take a backup, read the release notes, then update. Do not fall far behind, because security fixes and newer devices depend on updates.

### Where should backups go?

At least one copy somewhere other than the controller: a network drive, another computer or a cloud storage service you choose. Keep the encryption key, if there is one, somewhere safe too.

### Can someone else take over the system later?

Yes. With the administrator credentials, the documentation and a backup, another installer or a technical family member can take over. See [local control versus Google, Apple and SmartThings](/guides/local-smart-home-vs-google-apple-smartthings/).

## Set it up once

Backups, an off-controller copy and a UPS are an afternoon's work, and they decide how bad a bad day is. See [how we work](/how-it-works/) for what is in the handover.

Already have a controller and not sure it is backed up? [Ask us](/#contact) and we will tell you what to check.
