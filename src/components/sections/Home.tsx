import { Contact } from './Contact'
import { Custom } from './Custom'
import { Faq } from './Faq'
import { Hero } from './Hero'
import { Homes } from './Homes'
import { Planner } from './Planner'
import { Platform } from './Platform'
import { Process } from './Process'
import { Solutions } from './Solutions'
import { Upcoming } from './Upcoming'

/** The homepage sections, in order. Its own chunk (see src/views.ts). */
export function HomePage() {
  return (
    <>
      <Hero />
      <Solutions />
      <Custom />
      <Homes />
      <Process />
      <Platform />
      <Faq />
      <Upcoming />
      <Planner />
      <Contact />
    </>
  )
}
