import { writeFileSync } from 'fs'

const COLUMN_MAP = {
  0: 'apellido', 1: 'nombre', 2: 'cedula', 3: 'edad', 4: 'menor',
  5: 'sexo', 6: 'hospital', 7: 'area', 8: 'pisoCama', 9: 'procedencia',
  10: 'diagnostico', 11: 'estado', 12: 'fechaReg', 13: 'hora',
  14: 'familiar', 15: 'fuente', 16: 'comentarios',
}

async function main() {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY
  const sheetId = process.env.SHEET_ID
  const range = process.env.SHEET_RANGE || 'A:Q'

  if (!apiKey || !sheetId) {
    console.error('Missing GOOGLE_SHEETS_API_KEY or SHEET_ID')
    process.exit(1)
  }

  const base = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values`

  const [metaRes, dataRes] = await Promise.all([
    fetch(`${base}/R1?key=${apiKey}`),
    fetch(`${base}/${range}?key=${apiKey}`),
  ])

  if (!dataRes.ok) {
    console.error('Failed to fetch sheet data:', dataRes.status)
    process.exit(1)
  }

  let updatedAt = null
  try {
    const meta = await metaRes.json()
    if (meta.values?.[0]?.[0]) updatedAt = meta.values[0][0]
  } catch {}

  const data = await dataRes.json()
  const rows = data.values || []

  const people = rows.slice(1).map((row) => {
    const person = {}
    for (let i = 0; i < 17; i++) {
      const key = COLUMN_MAP[i]
      if (key) person[key] = (row[i] || '').trim()
    }
    return person
  })

  writeFileSync('src/data/fallback.json', JSON.stringify({ data: people, updatedAt }, null, 2), 'utf-8')
  console.log(`Fallback saved: ${people.length} records, updatedAt: ${updatedAt}`)
}

main().catch(console.error)
