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
  updatedAt?: string | null
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
