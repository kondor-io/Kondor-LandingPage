import { motion } from 'framer-motion'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Plane, Sparkles } from 'lucide-react'

/* ── Data ─────────────────────────────────────────────── */
const clients = [
  {
    name: 'Maps organización',
    logoSrc: '/portfolio/maps.png',
    logoAlt: 'Logo MAPS',
    tagline: 'Partnership en plataforma',
  },
  {
    name: 'Club de campo La Federala',
    logoSrc: '/portfolio/IconoLF.ico',
    logoAlt: 'Logo La Federal',
    tagline: 'Comercialización y control',
  },
  {
    name: 'Club For Ever',
    logoSrc: '/portfolio/forever.png',
    logoAlt: 'Logo For Ever',
    tagline: 'Pagos y gestion',
  },
]

const labProjects = [
  {
    Icon: Plane,
    name: 'App de viajes',
    status: 'En desarrollo',
    statusClass: 'text-sky-200/95 bg-sky-500/12 border-sky-400/18',
  },
  {
    Icon: Sparkles,
    name: 'Exploración interna',
    status: 'Interno',
    statusClass: 'text-white/70 bg-white/[0.06] border-white/12',
  },
]

/* ── Motion helpers ───────────────────────────────────── */
const headerMotion = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.55 },
}
const staggerWrap = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

/* ── Carousel constants ───────────────────────────────── */
const N             = clients.length  // 3
const BUFFER        = 5               // cards in DOM: 1 hidden-left, 3 visible, 1 hidden-right
const CENTER        = 2               // index of center slot in the buffer
const GAP           = 20              // px between cards
const TRANSITION_MS = 620             // slide animation duration
const INTERVAL_MS   = 3000            // pause between auto-advances

// Initial baseIdx so that clients[0] starts at center slot
// center slot = baseIdx + CENTER  →  clients[(baseIdx + CENTER) % N] = clients[0]
// →  baseIdx = (N - CENTER + N) % N
const INIT_BASE = (N - CENTER + N) % N   // = 1 for N=3, CENTER=2

/* ── Card ─────────────────────────────────────────────── */
function ClientCard({ name, logoSrc, logoAlt, tagline, isCenter }) {
  return (
    <article
      className={`
        relative flex flex-col items-center justify-center min-h-[13rem]
        overflow-hidden rounded-2xl border select-none
        transition-all duration-500
        ${isCenter
          ? 'border-brand-accent/55 bg-brand-accent/[0.10] shadow-[0_0_80px_-8px_rgba(237,73,47,0.65)] scale-[1.04] z-10'
          : 'border-white/[0.04] bg-white/[0.025] opacity-35 scale-[0.96]'
        }
      `}
    >
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500"
        style={{
          background: 'radial-gradient(ellipse 90% 65% at 50% 0%, rgba(237,73,47,0.22), transparent 65%)',
          opacity: isCenter ? 1 : 0,
        }}
        aria-hidden
      />

      {/* Top accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-500 ${
          isCenter
            ? 'bg-gradient-to-r from-brand-accent/50 via-brand-accent to-brand-accent/50 opacity-100'
            : 'opacity-0'
        }`}
      />

      {/* Content */}
      <div className="relative flex w-full flex-col items-center justify-center gap-3 px-6 py-8">
        <div className="flex h-24 w-full max-w-[14rem] items-center justify-center">
          <img
            src={logoSrc}
            alt={logoAlt}
            className={`max-h-full w-full max-w-[12rem] object-contain transition-all duration-500 ${
              isCenter ? 'opacity-100 grayscale-0 scale-[1.06]' : 'opacity-55 grayscale'
            }`}
            loading="lazy"
            decoding="async"
          />
        </div>

        <p className={`text-center text-[11px] font-medium tracking-wide transition-all duration-500 ${
          isCenter ? 'text-brand-accent opacity-100' : 'text-white/25 opacity-60'
        }`}>
          {tagline}
        </p>

        <p className={`text-center text-sm font-semibold tracking-tight transition-all duration-500 ${
          isCenter ? 'text-white opacity-100' : 'text-white/35 opacity-60'
        }`}>
          {name}
        </p>
      </div>

      {/* Dot */}
      <div
        className={`absolute bottom-3 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full transition-all duration-500 ${
          isCenter
            ? 'bg-brand-accent shadow-[0_0_8px_rgba(237,73,47,0.9)] opacity-100'
            : 'bg-white/15 opacity-35'
        }`}
      />
    </article>
  )
}

/* ── Infinite sliding carousel ────────────────────────── */
function ClientsCarousel() {
  const containerRef = useRef(null)
  const [stepPx, setStepPx]    = useState(0)     // cardWidth + GAP
  const [baseIdx, setBaseIdx]  = useState(INIT_BASE)
  const [sliding, setSliding]  = useState(false)

  /* Measure one step = cardWidth + gap */
  useLayoutEffect(() => {
    const measure = () => {
      if (!containerRef.current) return
      const w        = containerRef.current.clientWidth
      const cardW    = (w - GAP * (3 - 1)) / 3   // 3 cards visible, 2 gaps
      setStepPx(cardW + GAP)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  /* Auto-advance every INTERVAL_MS */
  useEffect(() => {
    if (!stepPx) return
    const id = setInterval(() => {
      setSliding(true)
      // After animation completes: shift baseIdx and reset transform instantly
      setTimeout(() => {
        setBaseIdx(p => (p + 1) % N)
        setSliding(false)
      }, TRANSITION_MS)
    }, INTERVAL_MS)
    return () => clearInterval(id)
  }, [stepPx])

  /* Build the 5-card buffer with absoluteIdx to uniquely identify each physical card slot in the stream */
  const cards = Array.from({ length: BUFFER }, (_, i) => {
    const absoluteIdx = baseIdx + i;
    return {
      ...clients[absoluteIdx % N],
      absoluteIdx, // Unique key guarantees stable DOM nodes during reset
    }
  })

  // Start lighting up the incoming card exactly as it begins its journey to the center.
  // Simultaneous dimming of old center + brightening of new center = stationary spotlight effect.
  const highlightSlot = sliding ? CENTER + 1 : CENTER

  const cardW = stepPx ? stepPx - GAP : 0

  return (
    <div ref={containerRef} className="relative overflow-hidden py-16 -my-16">
      <div
        style={{
          display:    'flex',
          gap:        `${GAP}px`,
          /* Shift the track left by 1 step so slot 0 is hidden off-screen left */
          marginLeft: stepPx ? `-${stepPx}px` : 0,
          /* During slide: animate left by 1 more step */
          transform:  `translateX(${sliding && stepPx ? -stepPx : 0}px)`,
          transition: sliding
            ? `transform ${TRANSITION_MS}ms cubic-bezier(0.32,0,0.25,1)`
            : 'none',
          willChange: 'transform',
        }}
      >
        {cards.map((card, i) => (
          <div
            key={card.absoluteIdx}
            style={{ flexShrink: 0, width: cardW || '33.333%' }}
          >
            <ClientCard {...card} isCenter={i === highlightSlot} />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Lab card ─────────────────────────────────────────── */
function LabCard({ Icon, name, status, statusClass }) {
  return (
    <motion.div
      variants={fadeUp}
      className="flex items-center gap-4 rounded-xl border border-sky-400/10 bg-gradient-to-br from-white/[0.03] to-transparent px-4 py-4 sm:px-5 sm:py-4"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-sky-400/15 bg-sky-500/10 text-sky-100/90">
        <Icon size={22} strokeWidth={1.65} aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold tracking-tight text-white/92">{name}</p>
      </div>
      <span className={`shrink-0 rounded-md border px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] ${statusClass}`}>
        {status}
      </span>
    </motion.div>
  )
}

/* ── Section ──────────────────────────────────────────── */
export default function PortfolioSection() {
  return (
    <section id="portfolio" className="relative overflow-hidden py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-white/14 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-px z-[1] h-[2px] bg-gradient-to-r from-transparent via-brand-accent/32 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/15 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header */}
        <motion.div {...headerMotion} className="mb-10 lg:mb-14">
          <span className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">
            <span className="h-px w-8 bg-white/40" />
            Portfolio
          </span>
          <h2 className="max-w-3xl text-balance text-3xl font-black leading-tight tracking-tight text-white lg:text-4xl">
            Marcas y proyectos
            <br />
            <span className="text-brand-accent">con criterio compartido.</span>
          </h2>
        </motion.div>

        {/* Clients label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45 }}
          className="mb-4 flex flex-wrap items-center gap-3"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-brand-accent/85">
            Empresas que ya confían en nosotros
          </span>
          <span className="hidden h-px flex-1 bg-gradient-to-r from-white/12 to-transparent sm:block" aria-hidden />
        </motion.div>

        {/* Sliding carousel */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.50 }}
          className="mb-14 lg:mb-16"
        >
          <ClientsCarousel />
        </motion.div>

        {/* Lab label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45 }}
          className="mb-4 flex flex-wrap items-center gap-3"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-sky-300/75">
            Laboratorio
          </span>
          <span className="hidden h-px flex-1 bg-gradient-to-r from-sky-400/15 to-transparent sm:block" aria-hidden />
        </motion.div>

        <motion.div
          variants={staggerWrap}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
        >
          {labProjects.map((p) => (
            <LabCard key={p.name} {...p} />
          ))}
        </motion.div>

      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[1] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  )
}
