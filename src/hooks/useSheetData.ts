'use client'

import { useState, useEffect, useMemo } from 'react'
import { fetchSheet } from '@/lib/sheet'
import type { Person, Filters } from '@/lib/types'

interface UseSheetDataReturn {
  people: Person[]
  filtered: Person[]
  loading: boolean
  error: string | null
  filters: Filters
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
  uniqueHospitals: string[]
  uniqueProcedencias: string[]
  uniqueEstados: string[]
  updatedAt: string | null
}

const defaultFilters: Filters = {
  query: '',
  hospital: '',
  sexo: '',
  procedencia: '',
  estado: '',
  menor: '',
}

export function useSheetData(): UseSheetDataReturn {
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    fetchSheet()
      .then((res) => {
        if (!cancelled) {
          setPeople(res.data)
          setUpdatedAt(res.updatedAt ?? null)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [])

  const uniqueHospitals = useMemo(
    () => [...new Set(people.map((p) => p.hospital).filter(Boolean))].sort(),
    [people]
  )

  const uniqueProcedencias = useMemo(
    () => [...new Set(people.map((p) => p.procedencia).filter(Boolean))].sort(),
    [people]
  )

  const uniqueEstados = useMemo(
    () => [...new Set(people.map((p) => p.estado).filter(Boolean))].sort(),
    [people]
  )

  const filtered = useMemo(() => {
    return people.filter((person) => {
      const fullName = `${person.nombre} ${person.apellido}`.toLowerCase()
      const reverseName = `${person.apellido} ${person.nombre}`.toLowerCase()
      const cedula = person.cedula.toLowerCase()
      const query = filters.query.toLowerCase()

      if (query && !fullName.includes(query) && !reverseName.includes(query) && !cedula.includes(query)) {
        return false
      }
      if (filters.hospital && person.hospital !== filters.hospital) return false
      if (filters.sexo && person.sexo !== filters.sexo) return false
      if (filters.procedencia && person.procedencia !== filters.procedencia) return false
      if (filters.estado && person.estado !== filters.estado) return false
      if (filters.menor === 'S' && person.menor !== 'S') return false
      if (filters.menor === 'N' && person.menor !== 'N') return false

      return true
    })
  }, [people, filters])

  return {
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
  }
}
