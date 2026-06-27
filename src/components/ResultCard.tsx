'use client'

import type { Person } from '@/lib/types'

interface ResultCardProps {
  person: Person
  onSelect: (person: Person) => void
}

export function ResultCard({ person, onSelect }: ResultCardProps) {
  const estadoColor = (estado: string) => {
    const e = estado.toLowerCase()
    if (e.includes('ingreso') || e.includes('hospital')) return 'border-l-yellow-500'
    if (e.includes('alta') || e.includes('localizado') || e.includes('sobreviviente')) return 'border-l-green-500'
    if (e.includes('traslado') || e.includes('desplazado')) return 'border-l-blue-500'
    if (e.includes('fallecido') || e.includes('crítico')) return 'border-l-red-500'
    return 'border-l-gray-400'
  }

  return (
    <button
      onClick={() => onSelect(person)}
      className={`w-full text-left bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500 ${estadoColor(person.estado)}`}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-900">
              {person.nombre} {person.apellido}
            </h3>
            {person.edad && (
              <p className="text-sm text-gray-500">
                {person.edad} años {person.sexo === 'M' ? '· Hombre' : person.sexo === 'F' ? '· Mujer' : ''}
              </p>
            )}
          </div>
          {person.menor === 'S' && (
            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
              Menor
            </span>
          )}
        </div>

        <div className="mt-2 space-y-1 text-sm text-gray-600">
          {person.hospital && (
            <p className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {person.hospital}
            </p>
          )}
          {person.area && <p>{person.area} {person.pisoCama ? `· ${person.pisoCama}` : ''}</p>}
          {person.estado && (
            <p className="font-medium text-gray-800">Estado: {person.estado}</p>
          )}
        </div>
      </div>
    </button>
  )
}
