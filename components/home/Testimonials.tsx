'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Testimonial } from '@/lib/types'

const FALLBACK: Partial<Testimonial>[] = [
  {
    id: '1',
    customer_name: 'Aaliyah M.',
    rating: 5,
    review: 'Tati is literally so talented!! My coffin nails looked exactly like my inspiration pic. Everyone keeps asking where I got them 😍',
    nail_type: 'Coffin - Long',
  },
  {
    id: '2',
    customer_name: 'Sofia R.',
    rating: 5,
    review: "Best press-ons I've ever worn! They lasted 3 weeks without lifting. Already placed my second order 💅",
    nail_type: 'Almond - Medium',
  },
  {
    id: '3',
    customer_name: 'Destiny J.',
    rating: 5,
    review: 'Got these for prom and I felt like a queen. The custom art she did was INSANE. Worth every penny!',
    nail_type: 'Stiletto - Extra Long',
  },
]

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Partial<Testimonial>[]>(FALLBACK)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('testimonials')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data && data.length > 0) setTestimonials(data)
      })
  }, [])

  return (
    <section className="section bg-white">
      <div className="container-wide">
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-champagne-600 text-sm font-semibold tracking-widest uppercase mb-3"
          >
            ✦ Reviews
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl text-mink"
          >
            Happy Clients
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-7 flex flex-col"
            >
              <Quote size={28} className="text-champagne-300 mb-4" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating || 5)].map((_, j) => (
                  <Star key={j} size={14} className="fill-champagne-500 text-champagne-500" />
                ))}
              </div>

              <p className="text-nude-700 text-sm leading-relaxed flex-1 mb-6">
                &quot;{t.review}&quot;
              </p>

              <div className="flex items-center gap-3 border-t border-nude-100 pt-4">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: `hsl(${20 + i * 30}, 45%, 65%)` }}
                >
                  {t.customer_name?.[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-mink">{t.customer_name}</p>
                  {t.nail_type && (
                    <p className="text-xs text-nude-400">{t.nail_type}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
