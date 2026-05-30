import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: "Tati's Nails | Custom Handcrafted Press-On Nails",
    template: "%s | Tati's Nails",
  },
  description:
    "Custom handcrafted press-on nails made with love. Order your perfect set — choose your shape, length, color, and design. Ships to your door.",
  keywords: [
    'custom press on nails',
    'handcrafted nails',
    'custom nail sets',
    'press on nails',
    'nail art',
    "tati's nails",
  ],
  openGraph: {
    title: "Tati's Nails | Custom Handcrafted Press-On Nails",
    description: 'Custom handcrafted press-on nails made with love.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col bg-cream">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#FAF6F1',
              color: '#2C1810',
              border: '1px solid #EDD8C4',
              borderRadius: '12px',
              fontFamily: 'system-ui, sans-serif',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#C08A62', secondary: '#FAF6F1' },
            },
          }}
        />
      </body>
    </html>
  )
}
