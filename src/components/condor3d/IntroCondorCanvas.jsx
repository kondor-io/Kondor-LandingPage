import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { EffectComposer, Bloom, Vignette, HueSaturation } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { CondorModel } from './CondorModel'
import CondorLights from './CondorLights'

/*
 * Camera: [0, 0, 7]  — looking straight at origin along –Z.
 * Condor faces +Z (toward camera) so the viewer sees its face.
 *
 * Visible world-space ranges at z=0 (fov 58, aspect 16/9):
 *   halfH = 7 * tan(29°) ≈ 3.88    →  Y visible ≈ ±3.9
 *   halfW ≈ 3.88 * 1.778 ≈ 6.90    →  X visible ≈ ±6.9
 *
 * Phase 0: condor enters from LEFT (x ≈ –10) → centres at zona de vuelo.
 * Phase 1: condor climbs upward and exits top (y > 5).
 */

const RIGHT_X = 3.0   // zona de vuelo X in world units
const ZONE_Y  = 0.15  // slightly above centre-vertical

const PHASE_TARGETS = [
  {
    pos:      new THREE.Vector3(RIGHT_X, ZONE_Y, 0),
    rotX:     0,
    rotY:     0,
    rotZ:     0.10,
    speed:    3.6,
    doneWhen: (g) =>
      Math.abs(g.position.x - RIGHT_X) < 0.30 &&
      Math.abs(g.position.y - ZONE_Y)  < 0.30,
  },
  {
    pos:      new THREE.Vector3(RIGHT_X + 2.5, 18, 0),
    rotX:    -0.50,
    rotY:     0,
    rotZ:     0.38,
    speed:    3.2,
    doneWhen: (g) => g.position.y > 5.5,
  },
]

/* ─── Inner R3F scene ─── */
function IntroScene({ phase, onPhaseComplete, isMobile }) {
  const groupRef  = useRef()
  const didFire   = useRef(false)
  const prevPhase = useRef(phase)

  const attachGroup = (node) => {
    if (!node) return
    groupRef.current = node
    node.position.set(-10, 0.10, 0)
    node.rotation.set(0, -Math.PI * 0.38, 0)
  }

  useFrame((_, delta) => {
    const g = groupRef.current
    if (!g) return

    if (prevPhase.current !== phase) {
      prevPhase.current = phase
      didFire.current   = false
    }

    if (didFire.current) return

    const { pos, rotX, rotY, rotZ, speed, doneWhen } = PHASE_TARGETS[phase]
    const dt = Math.min(delta * speed, 0.12)

    g.position.lerp(pos, dt)
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, rotX, delta * 4.5)
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, rotY, delta * 3.5)
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, rotZ, delta * 3.0)

    if (doneWhen(g)) {
      didFire.current = true
      onPhaseComplete()
    }
  })

  return (
    <>
      <CondorLights />

      <group ref={attachGroup}>
        <CondorModel flapSpeed={0.90} />
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

/* ─── Exported component ─── */
export default function IntroCondorCanvas({ phase, onPhaseComplete }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 58 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
      }}
      dpr={[1, 1.5]}
      style={{ width: '100%', height: '100%', background: 'transparent', pointerEvents: 'none' }}
    >
      <IntroScene phase={phase} onPhaseComplete={onPhaseComplete} isMobile={isMobile} />
    </Canvas>
  )
}
