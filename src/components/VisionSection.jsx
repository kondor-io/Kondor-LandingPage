import { motion } from 'framer-motion'
import { Layers, Cpu, TrendingUp } from 'lucide-react'

const pillars = [
  {
    icon: Cpu,
    title: 'Ingeniería de criterio',
    body: 'Cada sistema se diseña y construye con buenas prácticas, sin atajos. Aplicamos estándares de ingeniería reales en cada capa del producto.',
  },
  {
    icon: Layers,
    title: 'Marca madre',
    body: 'Kondor es la empresa detrás de distintos productos y verticales. No somos un solo producto: somos la plataforma que los hace posibles.',
  },
  {
    icon: TrendingUp,
    title: 'Evolución continua',
    body: 'Acompañamos a las organizaciones en su transformación tecnológica para que puedan operar con el nivel de una gran corporación.',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function VisionSection() {
  return (
    <section
      id="vision"
      className="relative z-[30] py-24 lg:py-32 overflow-hidden border-y border-white/10 bg-[#1E1E24]/50 backdrop-blur-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-16 lg:mb-20"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-brand-accent tracking-[0.2em] uppercase mb-4">
            <span className="w-8 h-px bg-brand-accent" />
            Nuestra visión
          </span>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <h2 className="text-3xl lg:text-5xl font-black text-white leading-tight max-w-xl tracking-tight text-balance">
              Tecnología real,
              <br />
              construida con <span className="text-brand-accent">rigor</span>.
            </h2>
            <p className="text-white/60 text-base leading-relaxed max-w-sm lg:text-right">
              Somos cuatro personas con criterio técnico claro. Creamos sistemas para que las
              medianas organizaciones puedan operar como grandes corporaciones.
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6"
        >
          {pillars.map((pillar) => {
            const Icon = pillar.icon
            return (
              <motion.div
                key={pillar.title}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-md p-7 hover:border-brand-accent/35 hover:bg-white/[0.09] hover:shadow-glow transition-all duration-300"
              >
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />

                <div className="w-11 h-11 rounded-xl bg-brand-accent/15 border border-brand-accent/20 flex items-center justify-center mb-5 group-hover:bg-brand-accent/25 transition-colors duration-200">
                  <Icon size={20} className="text-brand-accent" />
                </div>
                <h3 className="text-base font-bold text-white mb-3">{pillar.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{pillar.body}</p>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <p className="text-xs text-white/45 max-w-md leading-relaxed">
            Nuestro foco inicial son las agencias de productores de seguros, pero nuestra visión es
            más amplia: cualquier organización que quiera dar el salto tecnológico.
          </p>
          <a
            href="#portfolio"
            className="text-xs font-semibold text-brand-accent hover:text-white transition-colors whitespace-nowrap"
          >
            Ver nuestros sistemas →
          </a>
        </motion.div>
      </div>
    </section>
  )
}
