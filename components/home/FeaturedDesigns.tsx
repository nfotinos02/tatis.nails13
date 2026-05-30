'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GalleryItem, GALLERY_CATEGORY_LABELS } from '@/lib/types'

// Fallback placeholder designs
const PLACEHOLDER_DESIGNS: Partial<GalleryItem>[] = [
  { id: '1', title: 'Almond Nudes', category: 'medium', image_url: '' },
  { id: '2', title: 'Coffin Glam', category: 'long', image_url: '' },
  { id: '3', title: 'Bridal Set', category: 'special-occasion', image_url: '' },
  { id: '4', title: 'Custom Art', category: 'custom-art', image_url: '' },
  { id: '5', title: 'Short & Sweet', category: 'short', image_url: '' },
  { id: '6', title: 'Seasonal Edition', category: 'seasonal', image_url: '' },
]

const EMOJIS = ['💅', '✨', '🌸', '🎀', '💎', '🌟']
const BG_CLASSES = [
  'bg-gradient-nude',
  'bg-gradient-champagne',
  'bg-nude-100',
  'bg-champagne-100',
  'bg-blush',
  'bg-nude-50',
]

export default function FeaturedDesigns() {
  const [designs, setDesigns] = useState<Partial<GalleryItem>[]>(PLACEHOLDER_DESIGNS)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('gallery')
      .select('*')
      .eq('is_featured', true)
      .order('sort_order')
      .limit(6)
      .then(({ data }) => {
        if (data && data.length > 0) setDesigns(data)
      })
  }, [])

  return (
    <section className="section bg-white">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-champagne-600 text-sm font-semibold tracking-widest uppercase mb-3"
          >
            ✦ Portfolio
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl text-mink mb-4"
          >
            Featured Designs
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-nude-500 max-w-md mx-auto"
          >
            A peek at some of my favorite sets. Every design is completely custom.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {designs.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative aspect-nail rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image or placeholder */}
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className={`w-full h-full ${BG_CLASSES[i % BG_CLASSES.length]} flex items-center justify-center`}>
                  <span className="text-5xl">{EMOJIS[i % EMOJIS.length]}</span>
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-mink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Labels */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white font-medium text-sm">{item.title}</p>
                {item.category && (
                  <p className="text-white/70 text-xs mt-0.5">
                    {GALLERY_CATEGORY_LABELS[item.category as keyof typeof GALLERY_CATEGORY_LABELS]}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link href="/gallery" className="btn-outline">
            View Full Gallery
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
