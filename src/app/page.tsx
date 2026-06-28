'use client'

import { useState } from 'react'
import type { Person } from '@/lib/types'
import { useSheetData } from '@/hooks/useSheetData'
import { StatsBar } from '@/components/StatsBar'
import { SearchBar } from '@/components/SearchBar'
import { FilterPanel } from '@/components/FilterPanel'
import { ResultList } from '@/components/ResultList'
import { PersonDetailModal } from '@/components/PersonDetailModal'

export default function Home() {
  const {
    people,
    filtered,
    loading,
    error,
    filters,
    setFilters,
    uniqueHospitals,
    uniqueProcedencias,
    uniqueEstados,
    updatedAt,
    isFallback,
  } = useSheetData()

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-gray-500 dark:text-gray-400">Cargando datos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 font-medium">Error al cargar los datos</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Intentar de nuevo
        </button>
      </div>
    )
  }

  return (
    <div>
      <StatsBar total={people.length} filtered={filtered.length} updatedAt={updatedAt} isFallback={isFallback} />
      {isFallback && (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 mb-4 text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>Mostrando datos de respaldo. La información podría no estar actualizada. Consulta la fuente original en <a href="https://drive.google.com/drive/folders/1o36ifaRz45kAs5rKzci49aD0mP5JB_YI" target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-yellow-900 dark:hover:text-yellow-100">Google Drive</a>.</span>
        </div>
      )}
      <SearchBar filters={filters} setFilters={setFilters} />
      <FilterPanel
        filters={filters}
        setFilters={setFilters}
        uniqueHospitals={uniqueHospitals}
        uniqueProcedencias={uniqueProcedencias}
        uniqueEstados={uniqueEstados}
      />
      <ResultList people={filtered} onSelect={handleSelectPerson} />
      <PersonDetailModal
        person={selectedPerson}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}
