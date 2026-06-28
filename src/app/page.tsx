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
      <StatsBar total={people.length} filtered={filtered.length} />
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
