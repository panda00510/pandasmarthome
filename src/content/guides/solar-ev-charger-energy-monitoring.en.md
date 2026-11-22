---
title: Energy monitoring for a home with solar panels or an EV charger
heading: Energy monitoring with solar panels or an EV charger
description: With solar panels or an EV charger at home, the monthly bill hides what is going on. Where the data comes from, what to show together and what to check first.
published: 2026-11-22
updated: 2026-11-22
points: Show solar output, home use, grid import and export, and EV charging on one screen, not in three apps | The data comes from the inverter, the charger and a meter in the board; check that each one can share data locally | Work inside the distribution board and on the charger is for a licensed electrical worker
---
Solar panels and an EV charger change how a home uses electricity. Solar produces during the day, the car can draw a lot in a few hours, and the bill only shows what is left at the end of the month. Energy monitoring puts the pieces together, so you can see what the panels produce, what the house uses, what goes to the car and what comes from the grid.

## What to show together

- **Solar output:** how much the panels produce through the day.
- **Home use:** what the whole house draws, and where you can, the large loads such as the aircon and the water heater.
- **Grid import and export:** what you take from the grid, and what you send back when solar produces more than the house uses.
- **EV charging:** when the car charged and how much it took.

Each of these often comes with its own app. The point of monitoring is to see them on one screen, over the same hours.

## Where the data comes from

- **The solar inverter.** The inverter turns the panels' output into household electricity, and most can report what they produce. Some share data on your home network; others only through the maker's cloud app. Ask the solar installer which one yours does.
- **The EV charger.** Many chargers report charging sessions, and some can be started, stopped or limited by another system. Check whether yours can do this locally or only through its own app.
- **A meter in the distribution board.** A meter with current sensors on the main supply, and on chosen circuits, measures what the house actually uses and what goes back to the grid. Installing it is electrical work for a licensed electrical worker.
- **Your utility account.** The household meter readings shown by your electricity provider are the numbers your bill is based on. They are useful for checking, but they usually arrive later and in less detail.

If a device can only share data through the maker's cloud, monitoring still works, but it stops when the internet or that service is down. Our guide on [what still works without internet](/guides/smart-home-without-internet/) explains the difference.

## Putting it on one screen

Home Assistant has an energy dashboard built for this: solar, grid import and export, and individual devices on the same chart, by hour and by day. Once the inverter, charger and meter are connected, it shows:

- How much of the solar output the house used directly, and how much went back to the grid.
- When the car charged, and whether that was during sunny hours.
- What the house draws at night, when nothing should be running.

The inverter, the charger and the meter can each connect to the controller over the home network, so plan network points for them. In a landed home, the inverter is often far from the router; see [network planning for a landed home](/guides/landed-home-network-multi-floor/).

## What you can do with it

- **Shift flexible loads into sunny hours,** such as a washing machine, a dishwasher or a water heater on a timer, if you want to use more of your own solar.
- **Charge the car when solar is producing,** if the charger can be controlled by another system. Otherwise, use the charger's own schedule.
- **Spot a load that should not be there,** such as a device that stays on at night.
- **Compare against your electricity plan,** if your plan has different day and night rates.

We do not promise a particular saving. The monitoring shows what happens; what you change is up to you.

## Check before you buy or install

- **Ask the solar installer** whether the inverter can share data on the home network, and whether a monitoring meter is included.
- **Ask the charger supplier** whether the charger can share data and be controlled by another system, and with which standard.
- **EV chargers in Singapore** are regulated by the Land Transport Authority, and installation is electrical work. Check LTA's current requirements before choosing a charger.
- **Leave space in the distribution board** for a monitoring meter, and ask your licensed electrical worker to confirm it.
- **In a condominium,** a charger in the car park is usually arranged through the management, and the monitoring options depend on that system.

## Common questions

### Can I see my solar output without an electrician?

Often, yes, if the inverter can already share its data. Measuring what the whole house uses, or what goes back to the grid, needs a meter in the distribution board, and that is work for a licensed electrical worker.

### Will it work when the internet is down?

Devices that share data on your home network keep reporting to a local controller. Devices that only report through a cloud app stop until the connection returns.

### Can the car charge only from solar?

Only if the charger can be controlled by another system and the monitoring measures what goes to the grid. Then the controller can start or limit charging when solar produces more than the house uses. Without that, use the charger's own schedule.

### Does monitoring work with an aircon-heavy home too?

Yes. In most Singapore homes the aircon is still the largest load. See [where the electricity goes in a Singapore home](/guides/reduce-aircon-electricity-smart-home/).

## Next step

List what you have (panels, inverter model, charger model) and what you want to find out. See [energy monitoring and safety sensors](/solutions/energy-monitoring/) for what we set up, and [smart home for landed homes](/homes/landed-smart-home/).

Have solar or an EV charger? [Tell us what you have](/#contact) and we will say what can be monitored.
