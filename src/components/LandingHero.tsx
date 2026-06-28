'use client'

import { useState } from 'react'

export function LandingHero() {
  const [showInfo, setShowInfo] = useState(true)

  if (!showInfo) return null

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-800 p-5 mb-6">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            <strong>Sismo VZLA 2026</strong> es una herramienta de búsqueda que consolida la información de las personas afectadas por el terremoto del <strong>24 de junio de 2026</strong> en Venezuela. Los datos provienen de los reportes oficiales de hospitales, centros de salud y refugios en las zonas del desastre.
          </p>
          <p>
            La base de datos se construye a partir de los archivos originales recopilados en la carpeta compartida de Google Drive, que incluye listados digitalizados de hospitales (Vargas, Pérez Carreño, Universitario de Caracas, Domingo Luciani, Clínica El Ávila, Ciudad Caribia, Catia), reportes de sobrevivientes y el consolidado general de todas las fuentes.
          </p>
          <p>
            <a href="https://drive.google.com/drive/folders/1o36ifaRz45kAs5rKzci49aD0mP5JB_YI" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Ver carpeta con todas las fuentes originales →
            </a>
          </p>
        </div>
        <button
          onClick={() => setShowInfo(false)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 flex-shrink-0"
          aria-label="Cerrar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}