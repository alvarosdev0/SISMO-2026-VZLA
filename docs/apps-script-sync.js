function importarDatos() {
  const ORIGINAL_ID = '15gUXyoBjsZK8RlixGotv635uY4t1m5Wu'
  const COPIA_ID = '1p52f-L6_nWTILqC1fZ-u9nNTmBeorwhnI5dxsTOKBz4'

  try {
    const temp = Drive.Files.copy(
      { title: 'TEMP_IMPORT', mimeType: 'application/vnd.google-apps.spreadsheet' },
      ORIGINAL_ID
    )
    const nuevos = SpreadsheetApp.openById(temp.id).getSheets()[0].getDataRange().getValues()
    DriveApp.getFileById(temp.id).setTrashed(true)

    if (nuevos.length < 2) throw new Error('El origen no tiene datos')

    const target = SpreadsheetApp.openById(COPIA_ID)
    const sheet = target.getSheets()[0]
    const cols = nuevos[0].length

    // Escribe en columna auxiliar R
    sheet.getRange(1, 18, nuevos.length, cols).setValues(nuevos)

    // Copia sobre A:Q en un solo paso
    sheet.getRange(1, 18, nuevos.length, cols).copyTo(sheet.getRange(1, 1, nuevos.length, cols))

    // Limpia auxiliar y filas sobrantes
    sheet.getRange(1, 18, sheet.getLastRow(), cols).clear()
    const maxRows = Math.max(sheet.getLastRow(), nuevos.length)
    if (maxRows > nuevos.length) {
      sheet.getRange(nuevos.length + 1, 1, maxRows - nuevos.length, 17).clear()
    }

    sheet.getRange('R1').setValue(DriveApp.getFileById(ORIGINAL_ID).getLastUpdated().toISOString())

  } catch (e) {
    console.error('Error en importación:', e.message)
  }
}
