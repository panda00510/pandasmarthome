import { Contact } from './Contact'
import { Custom } from './Custom'
import { Faq } from './Faq'
import { Hero } from './Hero'
import { Homes } from './Homes'
import { Planner } from './Planner'
import { Process } from './Process'
import { Showroom } from './Showroom'
import { Solutions } from './Solutions'

/**
 * Streamlined homepage flow — zero repeated images, zero duplicated scene lists:
 * Hero (travertine) -> Solutions + Situations index (alabaster) -> 3D Showroom (deep forest)
 * -> Homes (sandstone) -> Process + Deliverables (alabaster) -> Custom & Products (travertine)
 * -> Plan starter (sandstone) -> FAQ + Compatibility + Guides (alabaster) -> Contact (travertine).
 */
export function HomePage() {
  return (
    <>
      <Hero />
      <Solutions />
      <Showroom />
      <Homes />
      <Process />
      <Custom />
      <Planner />
      <Faq />
      <Contact />
    </>
  )
}
