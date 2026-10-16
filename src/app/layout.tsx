import type { Metadata, Viewport } from 'next'
import { Geist, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { UIProvider } from '@/components/UIContext'
import { Header } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Kanso — Task Board',
  description: 'Kanso — a calm task board for focused teams.',
  icons: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
}

export const viewport: Viewport = {
  themeColor: '#F6F4EF',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${mono.variable}`}>
      <body>
        <UIProvider>
          <Header />
          <Sidebar />
          <div className="md:pl-64">
            <main className="min-h-screen w-full pt-14">{children}</main>
          </div>
        </UIProvider>
      </body>
    </html>
  )
}
