import ScrollyCanvas from '@/components/ScrollyCanvas'
import Projects from '@/components/Projects'
import Features from '@/components/Features'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MusicPlayer from '@/components/MusicPlayer'
import ContactSection from '@/components/ContactSection'
import SakuraParticles from '@/components/SakuraParticles'
import Live2DWrapper from '@/components/Live2DWrapper'

export default function Home() {
  return (
    <main className="flex-1 min-h-screen" style={{ background: 'var(--bocchi-dark)' }}>
      {/* ── Global ambient layer ── */}
      <SakuraParticles />

      {/* ── Navigation ── */}
      <Navbar />

      {/* ── Scroll animation (hero + about + skills) ── */}
      <ScrollyCanvas />

      {/* ── Portfolio projects ── */}
      <Projects />

      {/* ── Skills & about cards ── */}
      <Features />

      {/* ── Contact ── */}
      <ContactSection />

      {/* ── Footer ── */}
      <Footer />

      {/* ── Floating UI ── */}
      <MusicPlayer />
      <Live2DWrapper />
    </main>
  )
}
