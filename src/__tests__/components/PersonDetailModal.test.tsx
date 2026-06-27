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
    render(<PersonDetailModal person={mockPerson} isOpen={false} onClose={jest.fn()} />)
    expect(screen.queryByText('MARÍA GONZÁLEZ')).not.toBeInTheDocument()
  })

  it('should render when isOpen is true', () => {
    render(<PersonDetailModal person={mockPerson} isOpen={true} onClose={jest.fn()} />)
    expect(screen.getByText('MARÍA GONZÁLEZ')).toBeInTheDocument()
  })

  it('should call onClose when close button is clicked', () => {
    const onClose = jest.fn()
    render(<PersonDetailModal person={mockPerson} isOpen={true} onClose={onClose} />)
    fireEvent.click(screen.getByLabelText('Cerrar'))
    expect(onClose).toHaveBeenCalled()
  })

  it('should show WhatsApp share link', () => {
    render(<PersonDetailModal person={mockPerson} isOpen={true} onClose={jest.fn()} />)
    expect(screen.getByText('Compartir por WhatsApp')).toBeInTheDocument()
  })

  it('should display Cedula field', () => {
    render(<PersonDetailModal person={mockPerson} isOpen={true} onClose={jest.fn()} />)
    expect(screen.getByText('12345678')).toBeInTheDocument()
  })
})
