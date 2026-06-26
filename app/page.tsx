import ScrollyCanvas from '@/components/ScrollyCanvas'
import Features from '@/components/Features'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <main className="flex-1 min-h-screen" style={{ background: '#0a0a0f' }}>
      <Navbar />
      <ScrollyCanvas />
      <Features />
      <Footer />
    </main>
  )
}
