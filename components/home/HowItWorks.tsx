'use client'

import { motion } from 'framer-motion'
import { ClipboardList, Image, Package, Sparkles } from 'lucide-react'

const steps = [
  {
    icon: ClipboardList,
    step: '01',
    title: 'Fill Out the Form',
    description: 'Choose your nail shape, length, colors, and describe your dream design. Upload inspiration photos too!',
  },
  {
    icon: Image,
    step: '02',
    title: 'I Design Your Set',
    description: 'I\'ll reach out within 24 hours to confirm details, then get to work handcrafting your custom set.',
  },
  {
    icon: Package,
    step: '03',
    title: 'Receive & Slay',
    description: 'Your nails are carefully packaged and shipped (or handed off locally). Apply and turn heads!',
  },
]

export default function HowItWorks() {
  return (
    <section className="section bg-gradient-nude">
      <div className="container-wide">
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-champagne-600 text-sm font-semibold tracking-widest uppercase mb-3"
          >
            ✦ The Process
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl text-mink"
          >
            How It Works
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[calc(50%+40px)] right-0 h-px border-t-2 border-dashed border-nude-300 z-0" />
              )}

              <div className="card p-8 text-center relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-brand mb-6 mx-auto">
                  <step.icon size={28} className="text-white" />
                </div>
                <span className="block text-xs font-bold text-champagne-500 tracking-widest mb-2">
                  STEP {step.step}
                </span>
                <h3 className="font-display text-xl text-mink mb-3">{step.title}</h3>
                <p className="text-nude-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
