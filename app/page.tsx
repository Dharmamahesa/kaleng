import ScrollyCanvas from '@/components/ScrollyCanvas'
import Projects from '@/components/Projects'
import Features from '@/components/Features'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MusicPlayer from '@/components/MusicPlayer'

export default function Home() {
  return (
    <main className="flex-1 min-h-screen" style={{ background: '#1a1520' }}>
      <Navbar />
      <ScrollyCanvas />
      <Projects />
      <Features />
      <Footer />
      <MusicPlayer />
    </main>
  )
}
