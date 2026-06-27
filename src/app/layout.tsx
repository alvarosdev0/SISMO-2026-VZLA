import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Layout } from '@/components/Layout'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Buscador de Personas — Terremoto Venezuela 2026',
  description: 'Busca información de personas afectadas por el terremoto del 24 de junio de 2026 en Venezuela',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.className}>
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
