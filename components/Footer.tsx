'use client'

import Link from 'next/link'
import { Sparkles, Instagram, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-mink text-nude-200 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-champagne-400" />
              <span className="font-display text-2xl text-white">Tati&apos;s Nails</span>
            </div>
            <p className="text-nude-400 text-sm leading-relaxed max-w-xs">
              Custom handcrafted press-on nails made with love and precision.
              Every set is a one-of-a-kind piece of wearable art.
            </p>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-nude-400 hover:text-champagne-400 transition-colors text-sm"
            >
              <Instagram size={16} />
              @tatisnails
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-widest uppercase mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/gallery', label: 'Gallery' },
                { href: '/order', label: 'Place an Order' },
                { href: '/my-orders', label: 'Track My Order' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-nude-400 hover:text-champagne-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-widest uppercase mb-4">
              Get in Touch
            </h4>
            <p className="text-nude-400 text-sm leading-relaxed">
              Have a question before ordering? Reach out — I&apos;d love to hear from you.
            </p>
            <Link
              href="/order"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full
                         border border-nude-600 text-nude-300 text-sm font-medium
                         hover:border-champagne-500 hover:text-champagne-400 transition-all"
            >
              ✨ Order a Custom Set
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-nude-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-nude-500 text-xs">
            © {new Date().getFullYear()} Tati&apos;s Nails. All rights reserved.
          </p>
          <p className="text-nude-500 text-xs flex items-center gap-1">
            Made with <Heart size={12} className="text-champagne-500 fill-champagne-500" /> and a lot of rhinestones
          </p>
        </div>
      </div>
    </footer>
  )
}
