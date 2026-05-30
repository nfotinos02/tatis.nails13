'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="section bg-mink relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-pattern opacity-10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-champagne-900/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-nude-900/20 rounded-full blur-3xl" />

      <div className="relative container-narrow text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <Sparkles className="text-champagne-400 w-10 h-10 mx-auto mb-6" />

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
            Ready for your{' '}
            <span className="text-champagne-400 italic">dream</span>{' '}
            nails?
          </h2>

          <p className="text-nude-300 text-lg mb-10 max-w-md mx-auto leading-relaxed">
            Every set is handcrafted just for you. Let&apos;s create something beautiful together.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/order"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full
                         bg-gradient-to-r from-nude-400 to-champagne-500
                         text-white font-semibold text-base tracking-wide
                         shadow-lg hover:shadow-champagne-500/25 hover:shadow-xl
                         transition-all duration-300 hover:-translate-y-0.5"
            >
              Order Your Custom Set
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full
                         border-2 border-nude-600 text-nude-300
                         font-semibold text-base tracking-wide
                         hover:border-champagne-500 hover:text-champagne-400
                         transition-all duration-200"
            >
              Browse Gallery
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
