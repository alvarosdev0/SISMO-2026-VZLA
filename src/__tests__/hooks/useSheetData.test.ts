import { renderHook, act, waitFor } from '@testing-library/react'
import { useSheetData } from '@/hooks/useSheetData'

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
