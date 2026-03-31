import { motion } from 'framer-motion'
import { GripVertical } from 'lucide-react'

const blocks = [
  {
    title: 'Quiénes somos',
    body: 'Una arquitectura de pensamiento digital diseñada para la anticipación absoluta.',
  },
  {
    title: 'Qué hacemos',
    body: 'Decodificamos la complejidad para devolver simplicidad operativa y autonomía total.',
  },
  {
    title: 'Qué obtienes',
    body: 'Sistemas que aprenden y procesos que se superan a sí mismos por diseño.',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.6,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function InfoBlocks() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6"
    >
      {blocks.map((block) => (
        <motion.div
          key={block.title}
          variants={itemVariants}
          whileHover={{ x: 4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="group flex items-start gap-3 cursor-default"
        >
          <div className="mt-1 text-white/35 group-hover:text-brand-accent transition-colors duration-200 shrink-0">
            <GripVertical size={16} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-brand-accent transition-colors duration-200">
              {block.title}
            </h3>
            <p className="text-sm text-white/55 leading-relaxed">{block.body}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
