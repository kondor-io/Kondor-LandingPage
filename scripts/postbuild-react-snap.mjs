/**
 * react-snap runs Puppeteer/Chromium. Vercel's build image does not include
 * system libs Chromium needs (e.g. libnss3.so), so postbuild fails there.
 * Skip pre-render on Vercel; run `npm run build` locally if you need snap HTML.
 */
import { execSync } from 'node:child_process'

const skip =
  process.env.VERCEL === '1' ||
  process.env.VERCEL === 'true' ||
  process.env.SKIP_REACT_SNAP === '1'

if (skip) {
  console.log(
    '[postbuild] Skipping react-snap (CI/Vercel: Chromium system libraries unavailable).',
  )
  process.exit(0)
}

try {
  execSync('npx react-snap', { stdio: 'inherit', shell: true, cwd: process.cwd() })
} catch (err) {
  process.exit(err.status ?? 1)
}
