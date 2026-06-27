import type { SheetResponse } from './types'

export async function fetchSheet(): Promise<SheetResponse> {
  const res = await fetch('/api/sheet')
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}
