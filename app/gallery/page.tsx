'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GalleryItem, GalleryCategory, GALLERY_CATEGORY_LABELS } from '@/lib/types'
import { cn } from '@/lib/utils'

const EMOJIS = ['💅', '✨', '🌸', '🎀', '💎', '🌟', '🌺', '🦋', '🍒', '🫧']
const BG_CLASSES = [
  'bg-gradient-nude', 'bg-gradient-champagne', 'bg-nude-100',
  'bg-champagne-100', 'bg-blush', 'bg-nude-50',
]

const ALL_CATEGORIES: { value: GalleryCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Designs' },
  ...Object.entries(GALLERY_CATEGORY_LABELS).map(([value, label]) => ({
    value: value as GalleryCategory,
    label,
  })),
]

// Placeholder items for when DB is empty
const PLACEHOLDER: Partial<GalleryItem>[] = Array.from({ length: 12 }, (_, i) => ({
  id: `placeholder-${i}`,
  title: ['Almond Nudes', 'Coffin Glam', 'Bridal Set', 'Custom Art', 'Seasonal Set', 'Short & Sweet'][i % 6],
  category: (['medium', 'long', 'special-occasion', 'custom-art', 'seasonal', 'short'] as GalleryCategory[])[i % 6],
  is_featured: i < 3,
  image_url: '',
  sort_order: i,
}))

export default function GalleryPage() {
  const [items, setItems] = useState<Partial<GalleryItem>[]>(PLACEHOLDER)
  const [filtered, setFiltered] = useState<Partial<GalleryItem>[]>(PLACEHOLDER)
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | 'all'>('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Partial<GalleryItem> | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('gallery')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        if (data && data.length > 0) {
          setItems(data)
          setFiltered(data)
        }
      })
  }, [])

  useEffect(() => {
    let result = items
    if (activeCategory !== 'all') {
      result = result.filter((i) => i.category === activeCategory)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (i) =>
          i.title?.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [activeCategory, search, items])

  return (
    <div className="min-h-screen bg-cream pt-20">
      {/* Header */}
      <div className="bg-white border-b border-nude-100 py-16 px-4 text-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="inline-block text-champagne-600 text-sm font-semibold tracking-widest uppercase mb-3"
        >
          ✦ Portfolio
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl md:text-5xl text-mink mb-4"
        >
          Nail Gallery
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-nude-500 max-w-md mx-auto mb-8"
        >
          Browse my custom designs for inspiration — then order your own!
        </motion.p>

        {/* Search */}
        <div className="relative max-w-xs mx-auto">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-nude-400" />
          <input
            type="text"
            placeholder="Search designs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10 pr-10"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-nude-400 hover:text-mink"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Category filter */}
      <div className="sticky top-16 md:top-20 z-20 bg-white/95 backdrop-blur-sm border-b border-nude-100 px-4 py-3">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={cn(
                'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all',
                activeCategory === cat.value
                  ? 'bg-gradient-brand text-white shadow-sm'
                  : 'bg-nude-100 text-nude-600 hover:bg-nude-200'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-nude-500">No designs found. Try a different filter.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <AnimatePresence>
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelected(item)}
                  className="group relative aspect-nail rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className={`w-full h-full ${BG_CLASSES[i % BG_CLASSES.length]} flex items-center justify-center`}>
                      <span className="text-4xl">{EMOJIS[i % EMOJIS.length]}</span>
                    </div>
                  )}

                  {item.is_featured && (
                    <div className="absolute top-2 right-2 bg-gradient-brand text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                      Featured
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-mink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-medium text-xs">{item.title}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* CTA */}
        <div className="text-center mt-16 py-12 bg-gradient-nude rounded-3xl">
          <h3 className="font-display text-2xl md:text-3xl text-mink mb-3">
            See something you love?
          </h3>
          <p className="text-nude-500 mb-6 text-sm">
            Order a similar design — or something totally unique!
          </p>
          <Link href="/order" className="btn-primary">
            Order My Custom Set ✨
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 bg-mink/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl overflow-hidden max-w-sm w-full shadow-2xl"
            >
              <div className="aspect-nail bg-gradient-nude flex items-center justify-center">
                {selected.image_url ? (
                  <img src={selected.image_url} alt={selected.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-8xl">💅</span>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl text-mink mb-1">{selected.title}</h3>
                {selected.category && (
                  <p className="text-nude-400 text-sm mb-3">
                    {GALLERY_CATEGORY_LABELS[selected.category as GalleryCategory]}
                  </p>
                )}
                {selected.description && (
                  <p className="text-nude-600 text-sm mb-4">{selected.description}</p>
                )}
                <div className="flex gap-3">
                  <Link href="/order" className="btn-primary flex-1 justify-center text-sm py-2.5">
                    Order Similar
                  </Link>
                  <button onClick={() => setSelected(null)} className="btn-outline py-2.5 px-4">
                    <X size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
