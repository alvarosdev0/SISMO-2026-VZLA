import { NextResponse } from 'next/server'
import { COLUMN_MAP, type Person, type SheetResponse } from '@/lib/types'
import fallbackData from '@/data/fallback.json'

export async function GET() {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY
  const sheetId = process.env.SHEET_ID
  const range = process.env.SHEET_RANGE || 'A:Q'

  if (!apiKey || !sheetId) {
    return NextResponse.json({
      data: fallbackData.data,
      updatedAt: fallbackData.updatedAt,
      fallback: true,
    } satisfies SheetResponse)
  }

  const base = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values`

  try {
    const [metaRes, dataRes] = await Promise.all([
      fetch(`${base}/R1?key=${apiKey}`),
      fetch(`${base}/${range}?key=${apiKey}`),
    ])

    if (!dataRes.ok) {
      return NextResponse.json({
        data: fallbackData.data,
        updatedAt: fallbackData.updatedAt,
        fallback: true,
      } satisfies SheetResponse)
    }

    let updatedAt: string | null = null
    try {
      const meta = await metaRes.json()
      if (meta.values?.[0]?.[0]) updatedAt = meta.values[0][0]
    } catch {}

    const data = await dataRes.json()
    const rows: string[][] = data.values || []

    if (rows.length < 2) {
      return NextResponse.json({ data: [], updatedAt } satisfies SheetResponse)
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
      updatedAt,
    } satisfies SheetResponse, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    })
  } catch {
    return NextResponse.json({
      data: fallbackData.data,
      updatedAt: fallbackData.updatedAt,
      fallback: true,
    } satisfies SheetResponse)
  }
}
