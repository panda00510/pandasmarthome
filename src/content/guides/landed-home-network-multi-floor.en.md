---
title: Wi-Fi and network planning for a multi-storey landed home
heading: Wi-Fi and network planning for a landed home over several floors
description: Concrete floors stop Wi-Fi in a landed home. Where the network starts, one wired access point per floor, cameras on PoE, and what to cable during renovation.
published: 2026-11-22
updated: 2026-11-22
points: Concrete slabs between floors block Wi-Fi, so plan one access point per floor rather than one strong router | Cable each access point back to one central point; wireless mesh through floors is the fallback, not the plan | Renovation is the cheap time to run network cable to every floor, the gate, cameras and the TV
---
In a landed home the network problem is not speed, it is reach. Two to four storeys of reinforced concrete, a car porch, a gate and sometimes a garden or a roof terrace are more than one router can cover. The reliable answer is a wired backbone with an access point on each floor, planned before the walls and ceilings close.

## Why landed homes are harder than flats

- **Concrete slabs between floors.** Wi-Fi passes through a wall or two on the same floor; a reinforced concrete floor slab cuts it hard, and two slabs usually stop it.
- **Distance.** The fibre often comes in on the ground floor, while bedrooms and the study are two floors up.
- **Outdoor areas.** The gate, the car porch and the garden are where cameras, the gate opener and a doorbell need a signal, and they are outside the house walls.
- **More devices.** More rooms mean more lights, aircon controls, curtains and sensors, and every one of them needs a connection that does not drop.

Our general guide to [Wi-Fi for a smart home](/guides/wifi-for-smart-home/) covers how smart devices use Wi-Fi. This guide is about the layout of a home over several floors.

## Start where the fibre comes in

Your broadband fibre ends at a termination point in the house, where the optical network terminal (the box that turns fibre into an Ethernet connection) sits. Everything else should be planned from one central point near it:

- **Pick one network spot.** A ventilated cabinet or a corner of a store room, not a sealed cupboard: routers, switches and a small controller give off heat.
- **Put the main equipment there.** Router, network switch, the smart home controller and, if you record cameras, the recorder.
- **Give it power you can protect.** A small uninterruptible power supply (UPS) here keeps the network, the controller and the cameras running through a short power cut.

If the termination point is in an awkward place, run one cable from it to the network spot rather than building the network around the awkward place.

## One access point per floor, wired back

Instead of one powerful router, place an access point on each floor, usually on the ceiling near the middle of the floor, and connect each one back to the network spot with an Ethernet cable. This is called wired backhaul.

- **Wired backhaul** gives each floor its own full-strength connection, and the access points hand your phone from one to the next as you walk around.
- **Wireless mesh** (access points that talk to each other over Wi-Fi) is the fallback when cable cannot be run. Through concrete floors each wireless hop loses speed, so it works best with a unit on every floor and line of sight up the stairwell.
- **Powerline adapters**, which send network over the electrical wiring, vary a lot from house to house. Treat them as a test, not a plan.

A top floor or an attic, a basement and a large garden may each need their own access point.

## Cable the outside and the fixed devices

While the cables are going in, add points for the devices that never move:

- **Cameras.** Use PoE (Power over Ethernet), which carries power and network on one cable, so each camera needs only one cable back to a PoE switch at the network spot. Wired cameras are steadier than Wi-Fi ones, and the UPS covers them too.
- **Gate and car porch.** An outdoor-rated access point or a wired point near the gate helps the gate opener, the doorbell and phones in the porch.
- **TV and desks.** A wired point behind each TV and at each desk takes the heaviest traffic off Wi-Fi.
- **Wall panels.** If you plan a wall tablet or touch panel, a network point (or at least power) behind it saves a trailing cable later.

Ask for spare conduit up the house, so a cable can be added later without opening walls.

## Zigbee and Thread need help on each floor too

Many sensors and switches use Zigbee or Thread, low-power radio networks separate from Wi-Fi. Mains-powered devices such as smart plugs and wired switches act as repeaters for battery sensors nearby. In a landed home:

- **Place the controller centrally**, or use a coordinator on a cable near the middle of the house rather than in a ground-floor corner.
- **Make sure every floor has a few mains-powered devices**, so battery sensors upstairs have something to connect to.
- **Avoid putting the coordinator right next to a Wi-Fi access point**, since they share the same 2.4 GHz band.

For how these networks fit together, see [what Matter is](/guides/what-is-matter/).

## Keep devices on their own network

A guest network keeps visitors off your main network. Many routers and access points can also run a separate network for smart devices, so a cheap gadget sits apart from your laptops. It is optional, but easier to set up at the start than to move dozens of devices later.

## Common questions

### Is a mesh system enough for a landed home?

It can be, if there is a mesh unit on every floor and the units can see each other through the stairwell. Through two concrete slabs, wireless mesh usually slows down a lot. Where you can run cable, wired backhaul is more reliable.

### How many access points does a landed home need?

Usually at least one per floor, plus one outdoors if the gate, porch or garden needs coverage. Large floors or thick internal walls can need two on a floor. A walk-through with a phone after the first ones are up shows where the gaps are.

### Can I add network cable after the renovation?

Yes, with surface trunking along walls and ceilings, or through existing conduit if there is room. It costs more and shows more than running cable before the ceilings close.

### Does a newer Wi-Fi standard fix coverage?

Not on its own. A newer standard helps devices that support it, but most smart home devices use 2.4 GHz Wi-Fi, Zigbee or Thread. Coverage comes from where the access points are and how they connect, not from the label on the box.

## Plan it with the rest of the house

Network cable is cheap compared with what it saves, as long as it goes in before the ceilings close. See [smart home for landed homes](/homes/landed-smart-home/) for how we plan a whole house, the [renovation preparation guide](/guides/renovation-smart-home-prep/), and [what still works without internet](/guides/smart-home-without-internet/).

Planning a landed home? [Send us the floor plan](/#contact) and we will mark where the network points should go.
