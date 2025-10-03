import './globals.css'
import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const cairo = Cairo({ 
  subsets: ['arabic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ألوميتال برو - الجودة والأناقة في منتجات الألوميتال',
  description: 'متخصصون في تصنيع وتركيب مطابخ وأبواب وشبابيك الألوميتال عالية الجودة',
  keywords: 'ألوميتال, مطابخ, أبواب, شبابيك, مصر',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a365d',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  )
}
