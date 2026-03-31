/*
 * CondorLights — cinematic 4-point lighting rig
 *
 * Key    : warm directional from front-top-right  → defines shape
 * Fill   : HemisphereLight cold sky / warm ground  → softens shadows
 * Rim    : cool-blue directional from behind-left  → separates wings from dark bg
 * Bounce : orange point from below                 → accent warmth
 */
export default function CondorLights() {
  return (
    <>
      {/* Key light — warm, front-centre-top */}
      <directionalLight
        position={[2, 5, 7]}
        color="#fff5e8"
        intensity={1.80}
        castShadow={false}
      />

      {/* Fill — hemisphere (cold sky / warm ground) */}
      <hemisphereLight
        skyColor="#7090b0"
        groundColor="#3d2010"
        intensity={0.45}
      />

      {/* Rim light — cool blue from behind-left, contours wings */}
      <directionalLight
        position={[-5, 1, -6]}
        color="#a0c8ff"
        intensity={0.55}
      />

      {/* Accent bounce — orange point from below, warm reflection */}
      <pointLight
        position={[0, -2, 2]}
        color="#ED492F"
        intensity={0.18}
        distance={6}
        decay={2}
      />
    </>
  )
}
