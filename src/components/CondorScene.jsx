import { useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import IntroCondorCanvas from './condor3d/IntroCondorCanvas'

const CURTAIN_DUR  = 0.75   // seconds — curtain open duration
const CURTAIN_EASE = [0.76, 0, 0.24, 1]

export default function CondorScene({ onIntroComplete }) {
  const [phase, setPhase]            = useState(0)
  const [curtainOpen, setCurtainOpen] = useState(false)
  const scheduled = useRef(false)   // prevent double-scheduling

  /*
   * Called by IntroCondorCanvas when each animation phase completes.
   *
   * Phase 0 → condor reached centre:
   *   • Open curtains immediately.
   *   • Start condor ascent (phase 1).
   *   • Schedule onIntroComplete() for when curtains are fully open.
   *     (CURTAIN_DUR ms + a small buffer so the page reveal is clean)
   *
   * Phase 1 → condor exited top:
   *   • Nothing to do — the page is already being revealed by the
   *     timer set in phase 0. Canvas will unmount with CondorScene.
   */
  const handlePhaseComplete = useCallback(() => {
    if (phase === 0 && !scheduled.current) {
      scheduled.current = true
      setCurtainOpen(true)
      setPhase(1)
      setTimeout(() => onIntroComplete(), Math.round(CURTAIN_DUR * 1000) + 80)
    }
  }, [phase, onIntroComplete])

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden"
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
    >
      {/*
       * Canvas z-index ABOVE the curtains (5) so the condor is visible
       * while it flies in front of the closed curtain background.
       */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
        <IntroCondorCanvas phase={phase} onPhaseComplete={handlePhaseComplete} />
      </div>

      {/* ── TOP CURTAIN ── */}
      <motion.div
        className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[#ED492F] via-[#5c2419] to-[#1E1E24]"
        style={{ height: '50%', zIndex: 5 }}
        animate={curtainOpen ? { y: '-100%' } : { y: 0 }}
        transition={{ duration: CURTAIN_DUR, ease: CURTAIN_EASE }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-transparent to-black/35 pointer-events-none" />
      </motion.div>

      {/* ── BOTTOM CURTAIN ── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-[#1E1E24] via-[#5c2419] to-[#ED492F]"
        style={{ height: '50%', zIndex: 5 }}
        animate={curtainOpen ? { y: '100%' } : { y: 0 }}
        transition={{ duration: CURTAIN_DUR, ease: CURTAIN_EASE }}
      >
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-t from-transparent to-black/35 pointer-events-none" />
      </motion.div>

      {/* ── Brand mark — fades out as curtains open ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={curtainOpen ? { opacity: 0 } : { opacity: 1, y: 0 }}
        transition={curtainOpen ? { duration: 0.18 } : { delay: 0.30, duration: 0.50 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2"
        style={{ zIndex: 12 }}
      >
        <img
          src="/kondor.png"
          alt="Kondor"
          className="h-7 w-auto opacity-90 [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.5))]"
        />
      </motion.div>
    </motion.div>
  )
}
