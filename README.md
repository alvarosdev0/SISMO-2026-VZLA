# Buscador de Personas — Sismo VZLA 2026

Herramienta web de búsqueda de personas afectadas por el terremoto del **24 de junio de 2026** en Venezuela. Los datos provienen de los reportes oficiales de hospitales, centros de salud y refugios recopilados en la [carpeta compartida de Google Drive](https://drive.google.com/drive/folders/1o36ifaRz45kAs5rKzci49aD0mP5JB_YI).

## Fuentes de datos

La información consolida los listados digitalizados de:

- Hospital Vargas de Caracas
- Hospital Pérez Carreño
- Hospital Universitario de Caracas
- Hospital General Dr. Domingo Luciani
- Clínica El Ávila
- Hospital Ciudad Caribia
- Hospital de Catia
- Reportes de sobrevivientes
- Consolidado general de todos los archivos

Los archivos originales (PDF, Excel) están disponibles en la [carpeta pública de Google Drive](https://drive.google.com/drive/folders/1o36ifaRz45kAs5rKzci49aD0mP5JB_YI).

## Tecnología

- **Next.js** 16 (App Router)
- **TypeScript**
- **Tailwind CSS** v4
- **Google Sheets API** v4
- **Desplegado en Vercel** (plan gratuito)

## Funcionalidades

- Búsqueda por nombre, apellido o cédula
- Filtros por hospital, procedencia, estado, sexo, menor de edad
- Vista detallada de cada persona con datos completos
- Compartir por WhatsApp
- Modo oscuro
- Modo de respaldo (fallback) automático si la fuente de datos no está disponible

## Scripts

```bash
npm run dev          # Entorno de desarrollo
npm run build        # Build de producción
npm run test         # Pruebas
npm run update-fallback  # Actualiza snapshot local de respaldo
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `GOOGLE_SHEETS_API_KEY` | API Key de Google Cloud |
| `SHEET_ID` | ID del documento de Google Sheets |
| `SHEET_RANGE` | Rango de celdas (ej: A:Q) |

## Licencia

MIT
