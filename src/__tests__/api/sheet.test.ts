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
