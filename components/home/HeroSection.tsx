'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-nude bg-pattern">
      {/* Decorative blobs */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-champagne-100 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-nude-100 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/3" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-champagne-100 text-champagne-700 text-xs font-semibold tracking-widest uppercase mb-6"
            >
              <Star size={12} className="fill-current" />
              Handcrafted with love
              <Star size={12} className="fill-current" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl text-mink leading-tight mb-6"
            >
              Your nails,{' '}
              <span className="text-gradient italic">your</span>
              <br />
              way. ✨
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-nude-600 text-lg leading-relaxed mb-8 max-w-md"
            >
              Custom press-on nail sets designed and handcrafted just for you.
              Choose your shape, length, colors, and design — I&apos;ll create
              a set you&apos;ll obsess over.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/order" className="btn-primary text-base py-4 px-8">
                Order Your Custom Set
                <ArrowRight size={18} />
              </Link>
              <Link href="/gallery" className="btn-outline text-base py-4 px-8">
                View Gallery
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-10 flex items-center gap-4"
            >
              <div className="flex -space-x-2">
                {['A', 'S', 'D', 'M'].map((letter, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                    style={{
                      background: `hsl(${20 + i * 15}, 45%, ${65 + i * 5}%)`,
                    }}
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5 mb-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-champagne-500 text-champagne-500" />
                  ))}
                </div>
                <p className="text-xs text-nude-500">
                  <strong className="text-mink">50+ happy customers</strong> and counting
                </p>
              </div>
            </motion.div>
          </div>

          {/* Hero image mosaic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Large card */}
              <div className="col-span-2 aspect-[16/9] rounded-3xl overflow-hidden bg-nude-200 shadow-xl relative">
                <Image
                  src="https://qvfdwgfmnxntzhepemhh.supabase.co/storage/v1/object/public/gallery-images/hero_nailsss.jpeg"
                  alt="Custom press-on nails — blue stiletto set with marble and pearl accents"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Small cards */}
              <div className="aspect-square rounded-2xl overflow-hidden bg-nude-100 shadow-lg relative">
                <Image
                  src="https://qvfdwgfmnxntzhepemhh.supabase.co/storage/v1/object/public/gallery-images/hero_nail_display.jpeg"
                  alt="Blue opalescent nail set on display stand"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-champagne-100 shadow-lg relative">
                <Image
                  src="https://qvfdwgfmnxntzhepemhh.supabase.co/storage/v1/object/public/gallery-images/hero_nail_sets.jpeg"
                  alt="Multiple custom nail sets flat-laid on marble"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3"
            >
              <span className="text-2xl">🎀</span>
              <div>
                <p className="text-xs font-semibold text-mink">Custom sets</p>
                <p className="text-xs text-nude-500">from $25</p>
              </div>
            </motion.div>

            {/* Floating badge 2 */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3"
            >
              <span className="text-2xl">⏱️</span>
              <div>
                <p className="text-xs font-semibold text-mink">Ships in</p>
                <p className="text-xs text-nude-500">3–7 days</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
