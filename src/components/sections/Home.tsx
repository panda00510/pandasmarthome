import { AiHero } from './AiHero'
import {
  AiFaqSection,
  CustomHardwareSection,
  DeskDevicesSection,
  HardwareProcessSection,
  SystemsSection,
} from './AiHardwareSections'
import { Contact } from './Contact'

/**
 * Panda Smart homepage — focused on Smart AI Hardware, with Panda Smart Home
 * positioned cleanly as one of Panda's flagship local system products:
 * AiHero (travertine) -> Desk AI Devices (alabaster) -> Custom ESP32 AI Hardware (deep forest)
 * -> Complete Local Systems incl. Panda Smart Home (sandstone) -> 5-Step Process (alabaster)
 * -> Hardware FAQ & Guides (travertine) -> Project Contact (sandstone).
 */
export function HomePage() {
  return (
    <>
      <AiHero />
      <DeskDevicesSection />
      <CustomHardwareSection />
      <SystemsSection />
      <HardwareProcessSection />
      <AiFaqSection />
      <Contact mode="hardware" />
    </>
  )
}
