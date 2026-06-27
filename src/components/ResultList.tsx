'use client'

import type { Person } from '@/lib/types'
import { ResultCard } from './ResultCard'

interface ResultListProps {
  people: Person[]
  onSelect: (person: Person) => void
}

export function ResultList({ people, onSelect }: ResultListProps) {
  if (people.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-lg font-medium">No se encontraron personas</p>
        <p className="text-sm mt-1">Intenta con otros términos de búsqueda o filtros</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {people.map((person, index) => (
        <ResultCard
          key={`${person.cedula || person.nombre}-${index}`}
          person={person}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
