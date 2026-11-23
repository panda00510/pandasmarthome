import { Contact } from './Contact'
import { Faq } from './Faq'
import { Hero } from './Hero'
import { Homes } from './Homes'
import { Planner } from './Planner'
import { Process } from './Process'
import { Showroom } from './Showroom'
import { Solutions } from './Solutions'

/**
 * Dedicated /smart-home/ product overview page for Panda Smart Home — houses
 * the full local-first residential automation experience (interactive scene
 * keypad, 6 solution areas, 3D showroom walkthrough, 4 Singapore home types,
 * 5-step installation process, interactive Plan Starter, FAQ + compatibility,
 * and Smart Home enquiry form).
 */
export function SmartHomePage() {
  return (
    <>
      <Hero />
      <Solutions />
      <Showroom />
      <Homes />
      <Process />
      <Planner />
      <Faq />
      <Contact mode="home" />
    </>
  )
}
