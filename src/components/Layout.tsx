'use client'

import { ReactNode } from 'react'
import { ThemeToggle } from './ThemeToggle'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 dark:bg-blue-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <div className="flex-1">
              <h1 className="text-xl font-bold leading-tight">Buscador de Personas</h1>
              <p className="text-blue-100 dark:text-blue-200 text-sm">Terremoto Venezuela — 24 de junio de 2026</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 w-full">
        {children}
      </main>
      <footer className="bg-gray-100 dark:bg-gray-900 border-t dark:border-gray-800 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Datos recopilados de hospitales y centros de atención. Actualización constante.</p>
      </footer>
    </div>
  )
}
