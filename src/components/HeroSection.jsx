import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'

export default function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col justify-center pt-20 lg:pt-24 overflow-hidden"
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      {/* Atmospheric glows */}
      <div className="absolute top-1/4 -left-32 w-[32rem] h-[32rem] rounded-full bg-brand-accent/20 blur-[110px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[28rem] h-[28rem] rounded-full bg-brand-accent/10 blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[78vh]">

          {/* ─── LEFT: Copy + CTA ─── */}
          <div className="flex flex-col justify-center gap-8">

            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.10, duration: 0.50 }}
            >
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-white/80 tracking-[0.22em] uppercase">
                <span className="w-8 h-px bg-white/40" />
                Software Factory
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.75, ease: 'easeOut' }}
              className="text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.03] tracking-tight text-balance drop-shadow-sm"
            >
              Orquestando
              <br />
              la evolución
              <br />
              <span className="text-brand-accent [text-shadow:0_0_56px_rgba(237,73,47,0.55)]">
                industrial
              </span>
            </motion.h1>

            {/* Tagline / lema */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.60 }}
              className="text-lg text-white/60 font-light leading-relaxed max-w-lg border-l-2 border-white/20 pl-5"
            >
              Sincronizando el instinto con la exactitud digital.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.55 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <motion.a
                href="#contacto"
                whileHover={{ scale: 1.04, boxShadow: '0 0 44px rgba(237,73,47,0.55)' }}
                whileTap={{ scale: 0.97 }}
                className="relative flex items-center gap-3 overflow-hidden rounded-2xl px-8 py-4 text-sm font-bold text-white"
                style={{
                  background: 'linear-gradient(135deg, #ED492F 0%, #c73520 60%, #9b2615 100%)',
                  boxShadow: '0 8px 32px -8px rgba(237,73,47,0.5), inset 0 1px 0 rgba(255,255,255,0.18)',
                }}
              >
                {/* Shimmer */}
                <motion.span
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                  animate={{ x: ['-100%', '220%'] }}
                  transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2.0, ease: 'easeInOut' }}
                />
                <span>Elevar mi organización</span>
                <ArrowRight size={16} className="shrink-0" />
              </motion.a>

              <motion.a
                href="#vision"
                whileHover={{ x: 3 }}
                className="flex items-center gap-2 text-sm text-white/55 hover:text-white transition-colors"
              >
                <ChevronDown size={15} />
                Conocer más
              </motion.a>
            </motion.div>

            {/* Subtle stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.80, duration: 0.70 }}
              className="flex items-center gap-8 pt-4 border-t border-white/10"
            >
              {[
                { value: '3+', label: 'Productos en producción' },
                { value: '100%', label: 'Ingeniería propia' },
                { value: '4', label: 'Especialistas' },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-xl font-black text-white">{value}</span>
                  <span className="text-[10px] text-white/45 uppercase tracking-widest leading-tight">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ─── RIGHT: Condor visual stage ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.90 }}
            className="hidden lg:flex flex-col items-center justify-center relative min-h-[520px]"
          >
            {/* Large ambient glow that "frames" where the condor hovers */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-80 h-80 rounded-full bg-brand-accent/[0.07] blur-[72px]" />
            </div>

            {/* Concentric decorative rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[340px] h-[340px] rounded-full border border-white/[0.07]"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[240px] h-[240px] rounded-full border border-brand-accent/[0.12]"
            />

            {/* Orbiting accent dot */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[240px] h-[240px]"
              style={{ transformOrigin: '50% 50%' }}
            >
              <div
                className="absolute w-2.5 h-2.5 rounded-full bg-brand-accent"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -120px)',
                  boxShadow: '0 0 18px rgba(237,73,47,0.8)',
                }}
              />
            </motion.div>

            {/* Central pulse dot */}
            <motion.div
              animate={{ scale: [1, 1.22, 1] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-4 h-4 rounded-full bg-brand-accent"
              style={{ boxShadow: '0 0 28px rgba(237,73,47,0.75)' }}
            />

            {/* Corner label */}
            <div className="absolute bottom-6 right-0 text-right pointer-events-none">
              <p className="text-[10px] font-semibold text-white/25 tracking-[0.18em] uppercase">
                Zona de vuelo
              </p>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#1E1E24]/60 to-transparent pointer-events-none" />
    </section>
  )
}
