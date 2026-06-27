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
