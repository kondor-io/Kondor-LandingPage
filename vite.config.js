import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

/*
 * Patch: @react-three/postprocessing v2.x imports `WebGLMultipleRenderTargets`
 * from Three.js, but that class was removed in r153.
 * The SSR effect is the only consumer — we never use SSR, so we alias it to
 * WebGLRenderTarget (its direct replacement).
 *
 * Two patches are required:
 *  1. Vite `transform` hook  → fixes the Rollup production build
 *  2. esbuild plugin         → fixes `npm run dev` optimizeDeps pre-bundling
 */
function patchSSRCode(code) {
  let patched = code.replace(/,\s*WebGLMultipleRenderTargets\b/g, '')
  patched = patched.replace(/\bWebGLMultipleRenderTargets\b/g, 'WebGLRenderTarget')
  return patched
}

function patchPostprocessingSSR() {
  return {
    name: 'patch-r3f-postprocessing-ssr',
    transform(code, id) {
      if (!id.includes('screen-space-reflections')) return
      return { code: patchSSRCode(code), map: null }
    },
  }
}

export default defineConfig({
  plugins: [react(), patchPostprocessingSSR()],
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: 'patch-ssr-esbuild',
          setup(build) {
            build.onLoad({ filter: /screen-space-reflections/ }, (args) => {
              const code = fs.readFileSync(args.path, 'utf8')
              return { contents: patchSSRCode(code), loader: 'js' }
            })
          },
        },
      ],
    },
  },
})
