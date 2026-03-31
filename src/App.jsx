import { useState, Suspense, lazy } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import VisionSection from './components/VisionSection'
import PortfolioSection from './components/PortfolioSection'
import CTASection from './components/CTASection'
import Footer from './components/Footer'

/* Lazy-load 3-D components so Three.js (~600 KB min) splits into a
   separate chunk and does NOT block the initial HTML/CSS render. */
const CondorScene     = lazy(() => import('./components/CondorScene'))
const ScrollingCondor = lazy(() => import('./components/ScrollingCondor'))

export default function App() {
  const [introComplete, setIntroComplete] = useState(false)

  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* 3-D condor layer — loaded asynchronously via Suspense */}
      <Suspense fallback={null}>
        <AnimatePresence>
          {!introComplete && (
            <CondorScene onIntroComplete={() => setIntroComplete(true)} />
          )}
        </AnimatePresence>

        {/* Portaled to document.body — outside any CSS stacking context */}
        {introComplete && <ScrollingCondor />}
      </Suspense>

      {/* Page content — fades in when intro completes */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={introComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.85, ease: 'easeOut' }}
      >
        <Navbar />
        <main>
          <HeroSection />
          <AboutSection />
          <VisionSection />
          <PortfolioSection />
          <CTASection />
        </main>
        <Footer />
      </motion.div>

    </div>
  )
}
