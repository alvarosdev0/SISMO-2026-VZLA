import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

jest.mock('../../hooks/useSheetData', () => ({
  useSheetData: jest.fn(),
}))

const mockUseSheetData = jest.requireMock('../../hooks/useSheetData').useSheetData

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
      people: [{
        nombre: 'Test', apellido: '', cedula: '', edad: '', menor: '',
        sexo: '', hospital: '', area: '', pisoCama: '', procedencia: '',
        diagnostico: '', estado: 'Ingreso', fechaReg: '', hora: '',
        familiar: '', fuente: '', comentarios: '',
      }],
      filtered: [{
        nombre: 'Test', apellido: '', cedula: '', edad: '', menor: '',
        sexo: '', hospital: '', area: '', pisoCama: '', procedencia: '',
        diagnostico: '', estado: 'Ingreso', fechaReg: '', hora: '',
        familiar: '', fuente: '', comentarios: '',
      }],
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
