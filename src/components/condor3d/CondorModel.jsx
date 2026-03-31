import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

/*
 * ORIENTATION CONVENTION
 * Camera at [0, 0, 7] looking toward –Z.
 * → +Z  = toward camera  (FRONT: head, beak, face)
 * → –Z  = away from cam  (BACK: tail)
 * → X   = wingspan (left / right)
 * → Y   = vertical (up / down)
 *
 * WING RIG — two-level hierarchy:
 *   WingGroup  (main flap — the whole wing moves together → stays compact)
 *     └── TipFlex (small RELATIVE bend at wrist — organic feel, ≤0.08 rad diff)
 *
 * All panels inside WingGroup share the same parent rotation, so they
 * NEVER separate visually.  The tip panel only has a tiny additional flex
 * relative to the rest.
 */

/* ── PBR Materials ─────────────────────────────────────────────────────── */

const matBody = (
  <meshPhysicalMaterial
    color="#18181e" roughness={0.88} metalness={0}
    sheen={0.30} sheenColor="#3a3050"
  />
)
const matWingMid = (
  <meshPhysicalMaterial
    color="#1d1d26" roughness={0.84} metalness={0}
    sheen={0.18} sheenColor="#2e2840"
  />
)
const matWingOuter = (
  <meshPhysicalMaterial color="#151520" roughness={0.90} metalness={0} />
)
const matAccent = (
  <meshPhysicalMaterial
    color="#ED492F" emissive="#c03010" emissiveIntensity={0.18}
    roughness={0.70} metalness={0}
  />
)
const matAccentWarm = (
  <meshPhysicalMaterial color="#b83b25" roughness={0.76} metalness={0} />
)
const matBeakUpper = (
  <meshStandardMaterial color="#c8b070" roughness={0.30} metalness={0.05} />
)
const matBeakLower = (
  <meshStandardMaterial color="#b09050" roughness={0.42} metalness={0.02} />
)
const matCollar = (
  <meshStandardMaterial color="#f0ece6" roughness={0.94} metalness={0} />
)
const matEye = (
  <meshPhysicalMaterial
    color="#1a0800" roughness={0.04} metalness={0.10}
    emissive="#ED492F" emissiveIntensity={1.40}
  />
)

/* Deterministic micro-jitter per feather (stable across re-renders) */
function seedRng(seed) {
  const x = Math.sin(seed + 1) * 43758.5453123
  return x - Math.floor(x)
}

/* ─────────────────────────────────────────────────────────────────────────
   WingGroup — compact, two-level rig.
   wingRef : rotates the ENTIRE wing (main flap).
   tipRef  : rotates ONLY the tip sub-group RELATIVE to the wing (small flex).
   ─────────────────────────────────────────────────────────────────────── */
function WingGroup({ side, wingRef, tipRef }) {
  const d = side

  return (
    /* ── Main wing group — all panels live here and move as one ── */
    <group ref={wingRef}>

      {/* Inner panel (shoulder / tertials) */}
      <mesh position={[d * 0.50, 0, 0]}>
        <boxGeometry args={[0.84, 0.034, 0.62]} />
        {matBody}
      </mesh>

      {/* Mid panel (secondary coverts) — slightly different Z for depth */}
      <mesh position={[d * 1.23, 0, 0.012]}>
        <boxGeometry args={[0.90, 0.028, 0.56]} />
        {matWingMid}
      </mesh>

      {/* ── Tip sub-group — small RELATIVE flex on top of main flap ── */}
      {/*    pivot is at the wrist (~1.68 world units from body)         */}
      <group ref={tipRef} position={[d * 1.68, 0, 0]}>

        {/* Outer covert panel (position relative to tip pivot) */}
        <mesh position={[d * 0.38, 0, -0.010]} rotation={[0, 0, d * -0.025]}>
          <boxGeometry args={[0.72, 0.024, 0.46]} />
          {matWingOuter}
        </mesh>

        {/* Primary flight feathers — 5 fingers */}
        {[0, 1, 2, 3, 4].map((i) => {
          const spread = (i - 2) * 0.09
          const bx     = d * (0.66 + i * 0.058)
          const jY     = (seedRng(i * 17 + (d > 0 ? 100 : 0)) - 0.5) * 0.025
          const jRot   = (seedRng(i * 31 + (d > 0 ? 200 : 0)) - 0.5) * 0.020
          const mat    = i >= 3 ? matAccent : i === 2 ? matAccentWarm : matWingOuter
          return (
            <mesh
              key={i}
              position={[bx, jY, spread]}
              rotation={[jRot, d * spread * 0.16, 0]}
            >
              <boxGeometry args={[0.17, 0.020, 0.31 - i * 0.010]} />
              {mat}
            </mesh>
          )
        })}
      </group>

    </group>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   CondorModel
   ─────────────────────────────────────────────────────────────────────── */
export function CondorModel({ flapSpeed = 1.0, ...groupProps }) {
  /* One main-flap ref + one tip-flex ref per wing */
  const wLWing = useRef()
  const wRWing = useRef()
  const wLTip  = useRef()
  const wRTip  = useRef()

  const headRef = useRef()
  const tailRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * flapSpeed

    /*
     * Main flap — multi-frequency blend, applied to the whole wing.
     * Both wings use the SAME magnitude (just mirrored sign) so they
     * always look like a single connected surface.
     */
    const flap = Math.sin(t * 2.1) * 0.30
               + Math.sin(t * 4.35) * 0.05

    /*
     * Tip flex — small ADDITIONAL rotation applied to the tip sub-group
     * with a slight time delay, creating the organic wrist-bend effect.
     * Kept ≤ 0.08 rad so the gap at the wrist joint is imperceptible.
     */
    const tTip  = t - 0.18
    const flex  = Math.sin(tTip * 2.1) * 0.07
                + Math.sin(t    * 1.10) * 0.025  // slow gravity sag

    if (wLWing.current) wLWing.current.rotation.z = -flap
    if (wRWing.current) wRWing.current.rotation.z =  flap
    if (wLTip.current)  wLTip.current.rotation.z  = -flex
    if (wRTip.current)  wRTip.current.rotation.z  =  flex

    /* Micro head/tail compensation */
    if (headRef.current) headRef.current.rotation.x =  flap * 0.035
    if (tailRef.current) tailRef.current.rotation.x = -flap * 0.045
  })

  return (
    <group {...groupProps}>

      {/* ── Body — fatter capsule along Z ── */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.205, 0.82, 8, 16]} />
        {matBody}
      </mesh>

      {/* ── Neck collar ── */}
      <mesh position={[0, 0.04, 0.36]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.212, 0.062, 8, 20, Math.PI * 1.4]} />
        {matCollar}
      </mesh>

      {/* ── Head group ── */}
      <group ref={headRef}>
        <mesh position={[0, 0.10, 0.70]}>
          <sphereGeometry args={[0.185, 12, 12]} />
          {matBody}
        </mesh>

        {/* Upper beak */}
        <mesh position={[0, 0.035, 0.97]} rotation={[0.26, 0, 0]}>
          <coneGeometry args={[0.040, 0.22, 6]} />
          {matBeakUpper}
        </mesh>

        {/* Lower mandible */}
        <mesh position={[0, -0.005, 0.91]} rotation={[0.06, 0, 0]}>
          <coneGeometry args={[0.028, 0.13, 5]} />
          {matBeakLower}
        </mesh>

        {/* Eyes */}
        {[1, -1].map((s) => (
          <mesh key={s} position={[s * 0.105, 0.16, 0.76]}>
            <sphereGeometry args={[0.030, 8, 8]} />
            {matEye}
          </mesh>
        ))}
      </group>

      {/* ── Tail group ── */}
      <group ref={tailRef}>
        {[-0.14, 0, 0.14].map((ox, i) => (
          <mesh key={i} position={[ox, -0.09, -0.68]} rotation={[0.24, 0, ox * 0.09]}>
            <boxGeometry args={[0.13, 0.022, 0.52]} />
            {matBody}
          </mesh>
        ))}
      </group>

      {/* ── Wings ── */}
      <WingGroup side={-1} wingRef={wLWing} tipRef={wLTip} />
      <WingGroup side={1}  wingRef={wRWing} tipRef={wRTip} />

    </group>
  )
}
