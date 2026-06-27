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
