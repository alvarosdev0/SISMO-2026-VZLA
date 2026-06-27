import { NextResponse } from 'next/server'
import { COLUMN_MAP, type Person, type SheetResponse } from '@/lib/types'

export async function GET() {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY
  const sheetId = process.env.SHEET_ID
  const range = process.env.SHEET_RANGE || 'A:Q'

  if (!apiKey || !sheetId) {
    return NextResponse.json(
      { error: 'Missing API configuration' },
      { status: 500 }
    )
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`

  const response = await fetch(url)

  if (!response.ok) {
    return NextResponse.json(
      { error: 'Failed to fetch sheet data' },
      { status: response.status }
    )
  }

  const data = await response.json()
  const rows: string[][] = data.values || []

  if (rows.length < 2) {
    return NextResponse.json({
      data: [],
      updatedAt: new Date().toISOString(),
    } satisfies SheetResponse)
  }

  const people: Person[] = rows.slice(1).map((row: string[]) => {
    const person: Record<string, string> = {}
    for (let i = 0; i < 17; i++) {
      const key = COLUMN_MAP[i]
      if (key) {
        person[key] = (row[i] || '').trim()
      }
    }
    return person as unknown as Person
  })

  return NextResponse.json({
    data: people,
    updatedAt: new Date().toISOString(),
  } satisfies SheetResponse, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
    },
  })
}
