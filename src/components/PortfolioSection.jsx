import { motion } from 'framer-motion'
import { Plane, Sparkles } from 'lucide-react'

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

function LogoTile({ name, logoSrc, logoAlt, tagline, className = '' }) {
  return (
    <motion.article
      variants={fadeUp}
      className={`group relative flex min-h-[9.5rem] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] px-6 py-10 transition-all duration-300 hover:border-brand-accent/35 hover:bg-brand-accent/[0.06] hover:shadow-[0_0_48px_-12px_rgba(237,73,47,0.35)] sm:min-h-[11rem] ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(237, 73, 47, 0.12), transparent 65%)',
        }}
        aria-hidden
      />
      <div className="relative flex w-full flex-1 flex-col items-center justify-center gap-3">
        <div className="flex h-24 w-full max-w-[16rem] items-center justify-center sm:h-28">
          <img
            src={logoSrc}
            alt={logoAlt}
            className="max-h-full w-full max-w-[14rem] object-contain transition duration-300 group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
          />
        </div>
        <p className="text-center text-[11px] font-medium tracking-wide text-white/38">{tagline}</p>
        <p className="text-center text-sm font-semibold tracking-tight text-white">{name}</p>
      </div>
    </motion.article>
  )
}

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
      <span
        className={`shrink-0 rounded-md border px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] ${statusClass}`}
      >
        {status}
      </span>
    </motion.div>
  )
}

export default function PortfolioSection() {
  return (
    <section id="portfolio" className="relative overflow-hidden py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-white/14 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-px z-[1] h-[2px] bg-gradient-to-r from-transparent via-brand-accent/32 to-transparent" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/15 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
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

        {/* Nivel 1 — Clientes */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45 }}
          className="mb-3 flex flex-wrap items-center gap-3"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-brand-accent/85">
            Empresas que ya confían en nosotros
          </span>
          <span className="hidden h-px flex-1 bg-gradient-to-r from-white/12 to-transparent sm:block" aria-hidden />
        </motion.div>

        <motion.div
          variants={staggerWrap}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="mb-14 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:mb-16"
        >
          {clients.map((c, idx) => (
            <LogoTile
              key={c.name}
              {...c}
              className={idx === 2 ? 'sm:col-span-2 sm:mx-auto sm:w-[min(100%,26rem)]' : ''}
            />
          ))}
        </motion.div>

        {/* Nivel 2 — Laboratorio (diferenciado) */}
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
