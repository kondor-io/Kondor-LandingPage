import { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useScroll } from 'framer-motion'
import { EffectComposer, Bloom, Vignette, HueSaturation } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { CondorModel } from './CondorModel'
import CondorLights from './CondorLights'

/* ─────────────────────────────────────────────
   Piecewise-linear keyframe interpolation.
   ───────────────────────────────────────────── */
function kfLerp(p, keys) {
  if (p <= keys[0][0]) return keys[0][1]
  for (let i = 1; i < keys.length; i++) {
    const [p0, v0] = keys[i - 1]
    const [p1, v1] = keys[i]
    if (p <= p1) {
      const t = (p - p0) / (p1 - p0)
      return v0 + (v1 - v0) * t
    }
  }
  return keys[keys.length - 1][1]
}

/* ─────────────────────────────────────────────
   Scroll-driven scene — lives inside <Canvas>
   ───────────────────────────────────────────── */
function ScrollScene({ scrollYProgress, isMobile }) {
  const groupRef = useRef()
  const { camera, size } = useThree()

  const smoothX = useRef(null)
  const smoothY = useRef(0.15)

  useFrame((_, delta) => {
    if (!groupRef.current) return

    const p = scrollYProgress.get()

    const fovRad = (camera.fov * Math.PI) / 180
    const halfH  = camera.position.z * Math.tan(fovRad / 2)
    const halfW  = halfH * (size.width / size.height)
    const offL   = -(halfW * 1.55)
    const offR   =  (halfW * 1.55)

    const rightStart = halfW * 0.43

    if (smoothX.current === null) {
      smoothX.current = rightStart
      groupRef.current.position.x = rightStart
      groupRef.current.position.y = smoothY.current
    }

    const xKeys = [
      [0,    rightStart],
      [0.18, offR],
      [0.22, offL],
      [0.44, offR * 0.80],
      [0.48, offL],
      [0.70, offR * 0.65],
      [0.74, offL],
      [1.00, rightStart],
    ]

    const yKeys = [
      [0,    0.15],
      [0.18,  halfH * 0.40],
      [0.26, -halfH * 0.38],
      [0.44,  halfH * 0.50],
      [0.52, -halfH * 0.25],
      [0.70,  halfH * 0.20],
      [0.78, -halfH * 0.44],
      [1.00,  halfH * 0.15],
    ]

    const targetX = kfLerp(p, xKeys)
    const targetY = kfLerp(p, yKeys)

    smoothX.current = THREE.MathUtils.lerp(smoothX.current, targetX, Math.min(delta * 14, 0.25))
    smoothY.current = THREE.MathUtils.lerp(smoothY.current, targetY, Math.min(delta * 4.5, 0.12))

    groupRef.current.position.x = smoothX.current
    groupRef.current.position.y = smoothY.current

    const isOffscreen = smoothX.current < offL * 0.7 || smoothX.current > offR * 0.7
    const targetBank  = isOffscreen ? 0 : 0.24
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      targetBank,
      delta * 5,
    )
  })

  return (
    <>
      <CondorLights />

      <group ref={groupRef}>
        <CondorModel flapSpeed={1.10} />
      </group>

      {/* Postprocessing — disabled on mobile for performance */}
      {!isMobile && (
        <EffectComposer multisampling={4}>
          <Bloom
            luminanceThreshold={0.78}
            luminanceSmoothing={0.40}
            intensity={0.35}
            blendFunction={BlendFunction.ADD}
          />
          <Vignette offset={0.30} darkness={0.65} />
          <HueSaturation saturation={-0.08} />
        </EffectComposer>
      )}
    </>
  )
}

/* ─────────────────────────────────────────────
   Exported component — portaled to document.body
   ───────────────────────────────────────────── */
export default function ScrollCondorCanvas() {
  const { scrollYProgress } = useScroll()

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const maxDpr   = isMobile ? 1.2 : 2

  const [footerVisible, setFooterVisible] = useState(false)
  useEffect(() => {
    const footer = document.querySelector('footer')
    if (!footer) return
    const obs = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0 }
    )
    obs.observe(footer)
    return () => obs.disconnect()
  }, [])

  const el = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: footerVisible ? 0 : 1 }}
      transition={{ delay: footerVisible ? 0 : 0.30, duration: footerVisible ? 0.25 : 0.50 }}
      style={{ position: 'fixed', inset: 0, zIndex: 25, pointerEvents: 'none' }}
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 58 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        dpr={[1, maxDpr]}
        frameloop="always"
        style={{ width: '100%', height: '100%', background: 'transparent', pointerEvents: 'none' }}
      >
        <ScrollScene scrollYProgress={scrollYProgress} isMobile={isMobile} />
      </Canvas>
    </motion.div>
  )

  return createPortal(el, document.body)
}
