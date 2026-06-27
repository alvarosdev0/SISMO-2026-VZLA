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
