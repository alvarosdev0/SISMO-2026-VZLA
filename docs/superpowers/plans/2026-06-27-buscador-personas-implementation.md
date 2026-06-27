# Buscador de Personas — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a free web app to search for people affected by the 2026 Venezuela earthquake using a consolidated Google Sheet.

**Architecture:** Next.js 14+ App Router with a single API Route proxying Google Sheets API v4. All search/filter logic runs client-side in React state. Hosted on Vercel free tier.

**Tech Stack:** Next.js 14+, TypeScript, Tailwind CSS, Google Sheets API v4, Vercel

## Global Constraints

- Next.js 14+ with App Router (not Pages Router)
- TypeScript strict mode enabled
- Tailwind CSS for all styling (no CSS modules or styled-components)
- Google Sheets API key must only be used server-side (API Route), never exposed to client
- The sheet ID is `15gUXyoBjsZK8RlixGotv635uY4t1m5Wu`
- The sheet range is `A:Q` (17 columns)
- Column headers: APELLIDO(S) | NOMBRE(S) | CÉDULA/ID | EDAD | ¿MENOR? | SEXO | HOSPITAL/CENTRO | ÁREA/ZONA | PISO/CAMA | PROCEDENCIA | DIAGNÓSTICO/SERVICIO | ESTADO/CONDICIÓN | FECHA REG. | HORA | FAMILIAR | FUENTE | COMENTARIOS
- All data is in the first sheet (tab name: "PACIENTES SISMO LA GUAIRA")
- Font: Inter from Google Fonts
- Responsive design (mobile-first)

---

### Task 1: Project Scaffolding + Types

**Files:**
- Create: (entire project via `create-next-app`)
- Create: `src/lib/types.ts`
- Test: `src/__tests__/types.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `Person` interface, `SheetRow` type, `Filters` interface

- [ ] **Step 1: Initialize Next.js project**

```bash
cd C:\Users\alvar\Desktop\a
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Answer prompts: Yes to all defaults.

- [ ] **Step 2: Install additional dependencies**

```bash
npm install @heroicons/react
```

- [ ] **Step 3: Create `src/lib/types.ts`**

```typescript
export interface Person {
  apellido: string
  nombre: string
  cedula: string
  edad: string
  menor: string
  sexo: string
  hospital: string
  area: string
  pisoCama: string
  procedencia: string
  diagnostico: string
  estado: string
  fechaReg: string
  hora: string
  familiar: string
  fuente: string
  comentarios: string
}

export interface Filters {
  query: string
  hospital: string
  sexo: string
  procedencia: string
  estado: string
  menor: string
}

export interface SheetResponse {
  data: Person[]
  updatedAt: string
}

export const COLUMN_MAP: Record<number, keyof Person> = {
  0: 'apellido',
  1: 'nombre',
  2: 'cedula',
  3: 'edad',
  4: 'menor',
  5: 'sexo',
  6: 'hospital',
  7: 'area',
  8: 'pisoCama',
  9: 'procedencia',
  10: 'diagnostico',
  11: 'estado',
  12: 'fechaReg',
  13: 'hora',
  14: 'familiar',
  15: 'fuente',
  16: 'comentarios',
}
```

- [ ] **Step 4: Create `src/__tests__/types.test.ts`**

Create `src/__tests__/` directory first.

```typescript
import { COLUMN_MAP } from '@/lib/types'

describe('COLUMN_MAP', () => {
  it('should have 17 columns', () => {
    expect(Object.keys(COLUMN_MAP)).toHaveLength(17)
  })

  it('should map index 0 to apellido', () => {
    expect(COLUMN_MAP[0]).toBe('apellido')
  })

  it('should map index 6 to hospital', () => {
    expect(COLUMN_MAP[6]).toBe('hospital')
  })

  it('should map index 11 to estado', () => {
    expect(COLUMN_MAP[11]).toBe('estado')
  })
})
```

- [ ] **Step 5: Install Jest and run tests**

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
npx jest
```

Expected: Tests pass.

- [ ] **Step 6: Configure Jest**

Create `jest.config.ts`:

```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterSetup: ['<rootDir>/jest.setup.ts'],
}

export default createJestConfig(config)
```

Create `jest.setup.ts`:

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 7: Update `package.json` scripts**

Edit `package.json` to add test script:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "jest"
}
```

- [ ] **Step 8: Run tests to verify**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 9: Configure TypeScript strict mode**

Edit `tsconfig.json`: ensure `strict: true` is set.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js project with types"
```

---

### Task 2: API Route (Google Sheets Proxy)

**Files:**
- Create: `src/app/api/sheet/route.ts`
- Create: `.env.local`
- Test: `src/__tests__/api/sheet.test.ts`

**Interfaces:**
- Consumes: `Person` from types.ts, `COLUMN_MAP` from types.ts
- Produces: `GET /api/sheet` endpoint returning `SheetResponse`

- [ ] **Step 1: Create `.env.local`**

```
GOOGLE_SHEETS_API_KEY=placeholder
SHEET_ID=15gUXyoBjsZK8RlixGotv635uY4t1m5Wu
SHEET_RANGE=A:Q
```

- [ ] **Step 2: Create `src/app/api/sheet/route.ts`**

```typescript
import { NextResponse } from 'next/server'
import { COLUMN_MAP, type Person, type SheetResponse } from '@/lib/types'

export async function GET() {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY
  const sheetId = process.env.SHEET_ID
  const range = process.env.SHEET_RANGE || 'A:Q'

  if (!apiKey || !sheetId) {
    return NextResponse.json(
      { error: 'Missing API configuration' },
      { status: 500 }
    )
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`

  const response = await fetch(url)
  
  if (!response.ok) {
    return NextResponse.json(
      { error: 'Failed to fetch sheet data' },
      { status: response.status }
    )
  }

  const data = await response.json()
  const rows: string[][] = data.values || []

  if (rows.length < 2) {
    return NextResponse.json({
      data: [],
      updatedAt: new Date().toISOString(),
    } satisfies SheetResponse)
  }

  // Skip header row (index 0), map remaining rows to Person objects
  const people: Person[] = rows.slice(1).map((row: string[]) => {
    const person: Record<string, string> = {}
    for (let i = 0; i < 17; i++) {
      const key = COLUMN_MAP[i]
      if (key) {
        person[key] = (row[i] || '').trim()
      }
    }
    return person as unknown as Person
  })

  return NextResponse.json({
    data: people,
    updatedAt: new Date().toISOString(),
  } satisfies SheetResponse, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
    },
  })
}
```

- [ ] **Step 3: Create `src/__tests__/api/sheet.test.ts`**

```typescript
/**
 * @jest-environment node
 */

import { COLUMN_MAP } from '@/lib/types'

describe('Sheet API Route', () => {
  it('should have correct environment variables defined', () => {
    // This test checks that the env vars exist at build time
    // At runtime they will be provided by Vercel
    expect(process.env.SHEET_ID).toBeDefined()
    expect(process.env.SHEET_RANGE).toBe('A:Q')
  })

  it('should map all 17 columns correctly', () => {
    const expectedKeys = [
      'apellido', 'nombre', 'cedula', 'edad', 'menor', 'sexo',
      'hospital', 'area', 'pisoCama', 'procedencia', 'diagnostico',
      'estado', 'fechaReg', 'hora', 'familiar', 'fuente', 'comentarios',
    ]
    expectedKeys.forEach((key, index) => {
      expect(COLUMN_MAP[index]).toBe(key)
    })
  })
})
```

- [ ] **Step 4: Run tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add API route for Google Sheets proxy"
```

---

### Task 3: Data Fetching Hook

**Files:**
- Create: `src/lib/sheet.ts`
- Create: `src/hooks/useSheetData.ts`
- Test: `src/__tests__/hooks/useSheetData.test.ts`

**Interfaces:**
- Consumes: `SheetResponse`, `Person`, `Filters` from types.ts
- Produces: `fetchSheet()` function, `useSheetData()` hook

- [ ] **Step 1: Create `src/lib/sheet.ts`**

```typescript
import type { SheetResponse } from './types'

export async function fetchSheet(): Promise<SheetResponse> {
  const res = await fetch('/api/sheet')
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}
```

- [ ] **Step 2: Create `src/hooks/useSheetData.ts`**

```typescript
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

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    fetchSheet()
      .then((res) => {
        if (!cancelled) {
          setPeople(res.data)
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
      const query = filters.query.toLowerCase()

      if (query && !fullName.includes(query) && !reverseName.includes(query)) {
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
  }
}
```

- [ ] **Step 3: Create `src/__tests__/hooks/useSheetData.test.ts`**

```typescript
import { renderHook, act, waitFor } from '@testing-library/react'
import { useSheetData } from '@/hooks/useSheetData'

// Mock fetch
global.fetch = jest.fn()

const mockPeople = [
  {
    apellido: 'GONZÁLEZ',
    nombre: 'MARÍA',
    cedula: '12345678',
    edad: '45',
    menor: 'N',
    sexo: 'F',
    hospital: 'Hospital Vargas de Caracas',
    area: 'Trauma Shock',
    pisoCama: '',
    procedencia: 'La Guaira',
    diagnostico: 'Trauma',
    estado: 'Ingreso',
    fechaReg: '26/06/26',
    hora: '',
    familiar: '',
    fuente: 'L3-I1',
    comentarios: '',
  },
  {
    apellido: 'PÉREZ',
    nombre: 'JUAN',
    cedula: '87654321',
    edad: '8',
    menor: 'S',
    sexo: 'M',
    hospital: 'Hospital pared azul',
    area: 'Pediatría',
    pisoCama: '',
    procedencia: 'La Guaira',
    diagnostico: '',
    estado: 'Ingreso',
    fechaReg: '25/06/26',
    hora: '13:00',
    familiar: '',
    fuente: 'L2-I3',
    comentarios: 'Menor 8a',
  },
]

describe('useSheetData', () => {
  beforeEach(() => {
    ;(global.fetch as jest.Mock).mockReset()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: mockPeople,
        updatedAt: new Date().toISOString(),
      }),
    })
  })

  it('should fetch and return people data', async () => {
    const { result } = renderHook(() => useSheetData())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.people).toHaveLength(2)
    expect(result.current.filtered).toHaveLength(2)
  })

  it('should filter by query', async () => {
    const { result } = renderHook(() => useSheetData())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    act(() => {
      result.current.setFilters((prev) => ({ ...prev, query: 'MARÍA' }))
    })

    expect(result.current.filtered).toHaveLength(1)
    expect(result.current.filtered[0].nombre).toBe('MARÍA')
  })

  it('should filter by hospital', async () => {
    const { result } = renderHook(() => useSheetData())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    act(() => {
      result.current.setFilters((prev) => ({
        ...prev,
        hospital: 'Hospital pared azul',
      }))
    })

    expect(result.current.filtered).toHaveLength(1)
  })

  it('should filter by menor', async () => {
    const { result } = renderHook(() => useSheetData())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    act(() => {
      result.current.setFilters((prev) => ({ ...prev, menor: 'S' }))
    })

    expect(result.current.filtered).toHaveLength(1)
    expect(result.current.filtered[0].menor).toBe('S')
  })
})
```

- [ ] **Step 4: Run tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add data fetching hook with search and filter logic"
```

---

### Task 4: Layout + UI Shell

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Create: `src/components/Layout.tsx`
- Create: `src/components/StatsBar.tsx`

**Interfaces:**
- Consumes: `Person[]`
- Produces: `<Layout>`, `<StatsBar>` components

- [ ] **Step 1: Update `src/app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
}
```

- [ ] **Step 2: Update `src/app/layout.tsx`**

```typescript
import type { Metadata } from 'next'
import './globals.css'
import { Layout } from '@/components/Layout'

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
    <html lang="es">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Create `src/components/Layout.tsx`**

```typescript
'use client'

import { ReactNode } from 'react'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <div>
              <h1 className="text-xl font-bold leading-tight">Buscador de Personas</h1>
              <p className="text-blue-100 text-sm">Terremoto Venezuela — 24 de junio de 2026</p>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 w-full">
        {children}
      </main>
      <footer className="bg-gray-100 border-t py-4 text-center text-sm text-gray-500">
        <p>Datos recopilados de hospitales y centros de atención. Actualización constante.</p>
      </footer>
    </div>
  )
}
```

- [ ] **Step 4: Create `src/components/StatsBar.tsx`**

```typescript
interface StatsBarProps {
  total: number
  filtered: number
}

export function StatsBar({ total, filtered }: StatsBarProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">{total.toLocaleString()}</span>
          <span className="text-gray-500">personas registradas</span>
        </div>
        {total !== filtered && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-blue-600">{filtered.toLocaleString()}</span>
            <span className="text-gray-500">coinciden con tu búsqueda</span>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Run build check**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add layout shell and stats bar"
```

---

### Task 5: SearchBar Component

**Files:**
- Create: `src/components/SearchBar.tsx`
- Test: `src/__tests__/components/SearchBar.test.tsx`

**Interfaces:**
- Consumes: `filters: Filters`, `setFilters` updater
- Produces: `<SearchBar>` component

- [ ] **Step 1: Create `src/components/SearchBar.tsx`**

```typescript
'use client'

import { useCallback, useRef, useEffect } from 'react'
import type { Filters } from '@/lib/types'

interface SearchBarProps {
  filters: Filters
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
}

export function SearchBar({ filters, setFilters }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilters((prev) => ({ ...prev, query: e.target.value }))
    },
    [setFilters]
  )

  const handleClear = useCallback(() => {
    setFilters((prev) => ({ ...prev, query: '' }))
    inputRef.current?.focus()
  }, [setFilters])

  return (
    <div className="relative mb-4">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        ref={inputRef}
        type="text"
        value={filters.query}
        onChange={handleChange}
        placeholder="Buscar por nombre o apellido..."
        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
      />
      {filters.query && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          aria-label="Limpiar búsqueda"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create `src/__tests__/components/SearchBar.test.tsx`**

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { SearchBar } from '@/components/SearchBar'

describe('SearchBar', () => {
  const defaultFilters = {
    query: '',
    hospital: '',
    sexo: '',
    procedencia: '',
    estado: '',
    menor: '',
  }

  it('should render input with placeholder', () => {
    render(
      <SearchBar filters={defaultFilters} setFilters={jest.fn()} />
    )
    expect(screen.getByPlaceholderText('Buscar por nombre o apellido...')).toBeInTheDocument()
  })

  it('should call setFilters when typing', () => {
    const setFilters = jest.fn()
    render(
      <SearchBar filters={defaultFilters} setFilters={setFilters} />
    )

    const input = screen.getByPlaceholderText('Buscar por nombre o apellido...')
    fireEvent.change(input, { target: { value: 'MARÍA' } })

    expect(setFilters).toHaveBeenCalled()
  })

  it('should show clear button when query is not empty', () => {
    render(
      <SearchBar
        filters={{ ...defaultFilters, query: 'test' }}
        setFilters={jest.fn()}
      />
    )
    expect(screen.getByLabelText('Limpiar búsqueda')).toBeInTheDocument()
  })

  it('should not show clear button when query is empty', () => {
    render(
      <SearchBar filters={defaultFilters} setFilters={jest.fn()} />
    )
    expect(screen.queryByLabelText('Limpiar búsqueda')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add search bar component"
```

---

### Task 6: FilterPanel Component

**Files:**
- Create: `src/components/FilterPanel.tsx`
- Test: `src/__tests__/components/FilterPanel.test.tsx`

**Interfaces:**
- Consumes: `Filters`, `setFilters`, `uniqueHospitals`, `uniqueProcedencias`, `uniqueEstados`
- Produces: `<FilterPanel>` component

- [ ] **Step 1: Create `src/components/FilterPanel.tsx`**

```typescript
'use client'

import { useState } from 'react'
import type { Filters } from '@/lib/types'

interface FilterPanelProps {
  filters: Filters
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
  uniqueHospitals: string[]
  uniqueProcedencias: string[]
  uniqueEstados: string[]
}

export function FilterPanel({
  filters,
  setFilters,
  uniqueHospitals,
  uniqueProcedencias,
  uniqueEstados,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      query: filters.query,
      hospital: '',
      sexo: '',
      procedencia: '',
      estado: '',
      menor: '',
    })
  }

  const hasActiveFilters = filters.hospital || filters.sexo || filters.procedencia || filters.estado || filters.menor

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        Filtros
        {hasActiveFilters && (
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
            Activos
          </span>
        )}
      </button>

      {isOpen && (
        <div className="mt-3 p-4 bg-white border rounded-lg shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Hospital</label>
              <select
                value={filters.hospital}
                onChange={(e) => updateFilter('hospital', e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                {uniqueHospitals.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Procedencia</label>
              <select
                value={filters.procedencia}
                onChange={(e) => updateFilter('procedencia', e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas</option>
                {uniqueProcedencias.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Estado</label>
              <select
                value={filters.estado}
                onChange={(e) => updateFilter('estado', e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                {uniqueEstados.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Sexo</label>
              <select
                value={filters.sexo}
                onChange={(e) => updateFilter('sexo', e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Menor de edad</label>
              <select
                value={filters.menor}
                onChange={(e) => updateFilter('menor', e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="S">Sí</option>
                <option value="N">No</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-3 text-sm text-blue-600 hover:text-blue-800"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create `src/__tests__/components/FilterPanel.test.tsx`**

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { FilterPanel } from '@/components/FilterPanel'

describe('FilterPanel', () => {
  const defaultFilters = {
    query: '',
    hospital: '',
    sexo: '',
    procedencia: '',
    estado: '',
    menor: '',
  }

  const mockProps = {
    filters: defaultFilters,
    setFilters: jest.fn(),
    uniqueHospitals: ['Hospital A', 'Hospital B'],
    uniqueProcedencias: ['La Guaira', 'Caracas'],
    uniqueEstados: ['Ingreso', 'Traslado'],
  }

  it('should render filter toggle button', () => {
    render(<FilterPanel {...mockProps} />)
    expect(screen.getByText('Filtros')).toBeInTheDocument()
  })

  it('should show filters when clicked', () => {
    render(<FilterPanel {...mockProps} />)
    fireEvent.click(screen.getByText('Filtros'))
    expect(screen.getByText('Hospital')).toBeInTheDocument()
    expect(screen.getByText('Procedencia')).toBeInTheDocument()
  })

  it('should show active indicator when filters are applied', () => {
    render(
      <FilterPanel
        {...mockProps}
        filters={{ ...defaultFilters, hospital: 'Hospital A' }}
      />
    )
    expect(screen.getByText('Activos')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add filter panel component"
```

---

### Task 7: ResultCard + ResultList Components

**Files:**
- Create: `src/components/ResultCard.tsx`
- Create: `src/components/ResultList.tsx`
- Test: `src/__tests__/components/ResultCard.test.tsx`

**Interfaces:**
- Consumes: `Person`, `onSelect` callback
- Produces: `<ResultCard>`, `<ResultList>` components

- [ ] **Step 1: Create `src/components/ResultCard.tsx`**

```typescript
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
```

Wait, I have duplicate `className` in the button. Let me fix that in the actual file.

- [ ] **Step 2: Create `src/components/ResultList.tsx`**

```typescript
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
```

- [ ] **Step 3: Create `src/__tests__/components/ResultCard.test.tsx`**

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { ResultCard } from '@/components/ResultCard'

const mockPerson = {
  apellido: 'GONZÁLEZ',
  nombre: 'MARÍA',
  cedula: '12345678',
  edad: '45',
  menor: 'N',
  sexo: 'F',
  hospital: 'Hospital Vargas de Caracas',
  area: 'Trauma Shock',
  pisoCama: '',
  procedencia: 'La Guaira',
  diagnostico: 'Trauma',
  estado: 'Ingreso',
  fechaReg: '26/06/26',
  hora: '',
  familiar: '',
  fuente: 'L3-I1',
  comentarios: '',
}

describe('ResultCard', () => {
  it('should render person name', () => {
    render(<ResultCard person={mockPerson} onSelect={jest.fn()} />)
    expect(screen.getByText('MARÍA GONZÁLEZ')).toBeInTheDocument()
  })

  it('should render hospital name', () => {
    render(<ResultCard person={mockPerson} onSelect={jest.fn()} />)
    expect(screen.getByText('Hospital Vargas de Caracas')).toBeInTheDocument()
  })

  it('should call onSelect when clicked', () => {
    const onSelect = jest.fn()
    render(<ResultCard person={mockPerson} onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onSelect).toHaveBeenCalledWith(mockPerson)
  })

  it('should show "Menor" badge for minors', () => {
    render(
      <ResultCard
        person={{ ...mockPerson, menor: 'S' }}
        onSelect={jest.fn()}
      />
    )
    expect(screen.getByText('Menor')).toBeInTheDocument()
  })
})
```

- [ ] **Step 4: Run tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add result card and result list components"
```

---

### Task 8: PersonDetailModal Component

**Files:**
- Create: `src/components/PersonDetailModal.tsx`
- Test: `src/__tests__/components/PersonDetailModal.test.tsx`

**Interfaces:**
- Consumes: `Person`, `isOpen`, `onClose`
- Produces: `<PersonDetailModal>` component

- [ ] **Step 1: Create `src/components/PersonDetailModal.tsx`**

```typescript
'use client'

import { useEffect } from 'react'
import type { Person } from '@/lib/types'

interface PersonDetailModalProps {
  person: Person | null
  isOpen: boolean
  onClose: () => void
}

const LABELS: Record<keyof Person, string> = {
  apellido: 'Apellido(s)',
  nombre: 'Nombre(s)',
  cedula: 'Cédula/ID',
  edad: 'Edad',
  menor: 'Menor de edad',
  sexo: 'Sexo',
  hospital: 'Hospital/Centro',
  area: 'Área/Zona',
  pisoCama: 'Piso/Cama',
  procedencia: 'Procedencia',
  diagnostico: 'Diagnóstico/Servicio',
  estado: 'Estado/Condición',
  fechaReg: 'Fecha de Registro',
  hora: 'Hora',
  familiar: 'Familiar',
  fuente: 'Fuente',
  comentarios: 'Comentarios',
}

// Fields to always show in the modal
const DETAIL_FIELDS: (keyof Person)[] = [
  'nombre', 'apellido', 'cedula', 'edad', 'sexo', 'menor',
  'hospital', 'area', 'pisoCama', 'procedencia',
  'diagnostico', 'estado', 'fechaReg', 'hora',
  'familiar', 'fuente', 'comentarios',
]

export function PersonDetailModal({ person, isOpen, onClose }: PersonDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen || !person) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-lg font-semibold text-gray-900">
            {person.nombre} {person.apellido}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 space-y-3">
          {DETAIL_FIELDS.map((field) => {
            const value = person[field]
            if (!value) return null
            return (
              <div key={field}>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {LABELS[field]}
                </dt>
                <dd className="mt-0.5 text-sm text-gray-900">
                  {field === 'sexo'
                    ? value === 'M' ? 'Masculino' : value === 'F' ? 'Femenino' : value
                    : field === 'menor'
                    ? value === 'S' ? 'Sí' : value === 'N' ? 'No' : value
                    : value}
                </dd>
              </div>
            )
          })}
        </div>

        <div className="border-t px-6 py-4">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Estoy buscando a ${person.nombre} ${person.apellido} - ${person.hospital || ''}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Compartir por WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/__tests__/components/PersonDetailModal.test.tsx`**

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { PersonDetailModal } from '@/components/PersonDetailModal'

const mockPerson = {
  apellido: 'GONZÁLEZ',
  nombre: 'MARÍA',
  cedula: '12345678',
  edad: '45',
  menor: 'N',
  sexo: 'F',
  hospital: 'Hospital Vargas de Caracas',
  area: 'Trauma Shock',
  pisoCama: '',
  procedencia: 'La Guaira',
  diagnostico: 'Trauma',
  estado: 'Ingreso',
  fechaReg: '26/06/26',
  hora: '',
  familiar: '',
  fuente: 'L3-I1',
  comentarios: '',
}

describe('PersonDetailModal', () => {
  it('should not render when isOpen is false', () => {
    render(
      <PersonDetailModal person={mockPerson} isOpen={false} onClose={jest.fn()} />
    )
    expect(screen.queryByText('MARÍA GONZÁLEZ')).not.toBeInTheDocument()
  })

  it('should render when isOpen is true', () => {
    render(
      <PersonDetailModal person={mockPerson} isOpen={true} onClose={jest.fn()} />
    )
    expect(screen.getByText('MARÍA GONZÁLEZ')).toBeInTheDocument()
  })

  it('should call onClose when close button is clicked', () => {
    const onClose = jest.fn()
    render(
      <PersonDetailModal person={mockPerson} isOpen={true} onClose={onClose} />
    )
    fireEvent.click(screen.getByLabelText('Cerrar'))
    expect(onClose).toHaveBeenCalled()
  })

  it('should show WhatsApp share link', () => {
    render(
      <PersonDetailModal person={mockPerson} isOpen={true} onClose={jest.fn()} />
    )
    expect(screen.getByText('Compartir por WhatsApp')).toBeInTheDocument()
  })

  it('should display Cedula field', () => {
    render(
      <PersonDetailModal person={mockPerson} isOpen={true} onClose={jest.fn()} />
    )
    expect(screen.getByText('12345678')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add person detail modal with WhatsApp share"
```

---

### Task 9: Main Page Integration

**Files:**
- Modify: `src/app/page.tsx`
- Test: `src/__tests__/app/page.test.tsx`

**Interfaces:**
- Consumes: All components
- Produces: Main page

- [ ] **Step 1: Update `src/app/page.tsx`**

```typescript
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
        <p className="mt-4 text-gray-500">Cargando datos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 font-medium">Error al cargar los datos</p>
        <p className="text-gray-500 text-sm mt-1">{error}</p>
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
```

- [ ] **Step 2: Create `src/__tests__/app/page.test.tsx`**

```typescript
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

// Mock the hooks
jest.mock('@/hooks/useSheetData', () => ({
  useSheetData: jest.fn(),
}))

const mockUseSheetData = jest.requireMock('@/hooks/useSheetData').useSheetData

describe('Home Page', () => {
  beforeEach(() => {
    mockUseSheetData.mockReturnValue({
      people: [],
      filtered: [],
      loading: true,
      error: null,
      filters: {
        query: '',
        hospital: '',
        sexo: '',
        procedencia: '',
        estado: '',
        menor: '',
      },
      setFilters: jest.fn(),
      uniqueHospitals: [],
      uniqueProcedencias: [],
      uniqueEstados: [],
    })
  })

  it('should show loading state', () => {
    render(<Home />)
    expect(screen.getByText('Cargando datos...')).toBeInTheDocument()
  })

  it('should show error state', () => {
    mockUseSheetData.mockReturnValue({
      people: [],
      filtered: [],
      loading: false,
      error: 'Failed to fetch',
      filters: {
        query: '',
        hospital: '',
        sexo: '',
        procedencia: '',
        estado: '',
        menor: '',
      },
      setFilters: jest.fn(),
      uniqueHospitals: [],
      uniqueProcedencias: [],
      uniqueEstados: [],
    })
    render(<Home />)
    expect(screen.getByText('Error al cargar los datos')).toBeInTheDocument()
  })

  it('should show stats when data is loaded', () => {
    mockUseSheetData.mockReturnValue({
      people: [{ nombre: 'Test' }],
      filtered: [{ nombre: 'Test' }],
      loading: false,
      error: null,
      filters: {
        query: '',
        hospital: '',
        sexo: '',
        procedencia: '',
        estado: '',
        menor: '',
      },
      setFilters: jest.fn(),
      uniqueHospitals: [],
      uniqueProcedencias: [],
      uniqueEstados: [],
    })
    render(<Home />)
    expect(screen.getByText('personas registradas')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 4: Run build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: integrate main page with all components"
```

---

### Task 10: Vercel Deployment

**Files:**
- Create: `vercel.json` (if needed)
- Modify: `.env.local` example

- [ ] **Step 1: Create `.env.example`**

```
GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key
SHEET_ID=15gUXyoBjsZK8RlixGotv635uY4t1m5Wu
SHEET_RANGE=A:Q
```

- [ ] **Step 2: Push to GitHub**

```bash
# Create a new repo on GitHub first (via browser or gh CLI)
gh repo create buscador-terremoto-vzla --public --source=. --remote=origin --push
```

- [ ] **Step 3: Deploy to Vercel**

```bash
# Install Vercel CLI and deploy
npx vercel --prod
```

Follow the prompts: log in with GitHub, import the repo, set environment variables:
- `GOOGLE_SHEETS_API_KEY` → your Google Cloud API key
- `SHEET_ID` → `15gUXyoBjsZK8RlixGotv635uY4t1m5Wu`
- `SHEET_RANGE` → `A:Q`

- [ ] **Step 4: Verify deployment**

Visit the Vercel URL. Expected: The app loads, fetches data from the sheet, and allows searching.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: add deployment configuration"
```

---

**End of implementation plan**
