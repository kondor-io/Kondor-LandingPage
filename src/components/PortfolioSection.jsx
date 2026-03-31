import { motion } from 'framer-motion'
import { ArrowUpRight, Activity, GitBranch, Eye } from 'lucide-react'

const products = [
  {
    icon: Activity,
    name: 'Kondor Core',
    tagline: 'Gestión operativa de base',
    description:
      'Plataforma central de gestión operativa para organizaciones en crecimiento. Estructura, visibilidad y control en un único sistema.',
    status: 'En producción',
    statusColor: 'text-emerald-200 bg-emerald-500/20 border border-emerald-400/25',
    accentColor: 'group-hover:border-emerald-400/35',
    highlight: false,
  },
  {
    icon: GitBranch,
    name: 'Kondor Flow',
    tagline: 'Automatización de procesos',
    description:
      'Sistema de automatización de flujos operativos diseñado para organizaciones con procesos complejos de gestión y seguimiento.',
    status: 'En producción',
    statusColor: 'text-emerald-200 bg-emerald-500/20 border border-emerald-400/25',
    accentColor: 'group-hover:border-brand-accent/45',
    highlight: true,
  },
  {
    icon: Eye,
    name: 'Kondor Lens',
    tagline: 'Trazabilidad y auditoría',
    description:
      'Módulo de trazabilidad y auditoría para equipos distribuidos. Registro completo de operaciones con criterio de ingeniería.',
    status: 'En desarrollo',
    statusColor: 'text-sky-200 bg-sky-500/20 border border-sky-400/25',
    accentColor: 'group-hover:border-sky-400/35',
    highlight: false,
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.05 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

export default function PortfolioSection() {
  return (
    <section id="portfolio" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/15 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-white/90 tracking-[0.2em] uppercase mb-4">
            <span className="w-8 h-px bg-white/40" />
            Portfolio
          </span>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight text-balance">
              Los sistemas
              <br />
              que construimos.
            </h2>
            <p className="text-white/55 text-sm leading-relaxed max-w-xs">
              Cada producto de Kondor es un sistema de ingeniería diseñado para resolver un problema
              real con criterio técnico claro.
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {products.map((product) => {
            const Icon = product.icon
            return (
              <motion.div
                key={product.name}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                className={`group relative rounded-2xl border border-white/12 bg-white/[0.07] backdrop-blur-xl p-7 cursor-pointer overflow-hidden transition-all duration-300 shadow-panel ${product.accentColor} ${
                  product.highlight ? 'ring-1 ring-brand-accent/35' : ''
                }`}
              >
                {product.highlight && (
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-accent/20 via-brand-accent to-brand-accent/20" />
                )}

                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center transition-colors duration-200 group-hover:bg-white/15">
                    <Icon size={18} className="text-white/90" />
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg ${product.statusColor}`}
                  >
                    {product.status}
                  </span>
                </div>

                <div className="mb-3">
                  <h3 className="text-base font-bold text-white mb-0.5">{product.name}</h3>
                  <p className="text-xs font-medium text-brand-accent/90">{product.tagline}</p>
                </div>

                <p className="text-sm text-white/55 leading-relaxed mb-5">{product.description}</p>

                <div className="flex items-center gap-1 text-xs font-semibold text-white/40 group-hover:text-white transition-colors duration-200">
                  <span>Ver más</span>
                  <ArrowUpRight
                    size={13}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-10 text-center text-xs text-white/45"
        >
          Más sistemas en desarrollo. Hablá con el equipo para conocer la hoja de ruta.
        </motion.p>
      </div>
    </section>
  )
}
