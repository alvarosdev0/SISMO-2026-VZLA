import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Layout } from '@/components/Layout'
import { ThemeProvider } from 'next-themes'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

const title = 'Buscador de Personas — Sismo VZLA 2026'
const description =
  'Base de datos de personas afectadas por el terremoto del 24 de junio de 2026 en Venezuela. Busca por nombre, apellido o cédula en los registros de hospitales y centros de salud.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: 'website',
    siteName: 'Buscador de Personas — Sismo VZLA 2026',
    locale: 'es_VE',
  },
  twitter: {
    card: 'summary',
    title,
    description,
  },
  keywords: [
    'sismo Venezuela 2026',
    'terremoto Venezuela',
    'buscador de personas',
    'hospitales Venezuela',
    '24 de junio 2026',
    'Venezuela earthquake',
  ],
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.className} suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  )
}
