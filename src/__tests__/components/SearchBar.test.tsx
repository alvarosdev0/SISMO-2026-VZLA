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

  it('should call setFilters when typing (debounced)', () => {
    jest.useFakeTimers()
    const setFilters = jest.fn()
    render(
      <SearchBar filters={defaultFilters} setFilters={setFilters} />
    )

    const input = screen.getByPlaceholderText('Buscar por nombre o apellido...')
    fireEvent.change(input, { target: { value: 'MARÍA' } })
    jest.advanceTimersByTime(300)

    expect(setFilters).toHaveBeenCalled()

    jest.useRealTimers()
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
