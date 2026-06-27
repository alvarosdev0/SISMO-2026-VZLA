# Buscador de Personas — Terremoto Venezuela 2026

## Propósito

Aplicación web gratuita que permite a familiares y ciudadanos buscar información de personas afectadas por el terremoto del 24 de junio de 2026 en Venezuela. Los datos provienen de un Google Sheet consolidado con información de hospitales, centros de desplazados y refugios.

## Stack Tecnológico

| Componente | Tecnología | Razón |
|------------|-----------|-------|
| Frontend | Next.js 14+ (App Router) + React + TypeScript | Framework moderno, SSR opcional, facilidad de desarrollo |
| UI | Tailwind CSS | Rápido desarrollo responsive |
| Datos | Google Sheets API v4 | Fuente única, actualización en tiempo real |
| API Key | Google Cloud API Key (restringida a Sheets API + HTTP referrer) | Gratis, acceso de solo lectura |
| Hosting | Vercel (plan gratuito) | 100 GB ancho de banda/mes, deploys automáticos desde GitHub |
| Código | GitHub (repositorio público) | Gratis, integración con Vercel |

## Arquitectura

```
Google Sheet (público, solo lectura)
    │
    ▼
[Next.js API Route] /api/sheet
    │  (proxy con API Key, cachea respuestas)
    ▼
[Navegador] — React State (datos cargados una vez)
    │
    ▼
[Componentes]
    ├── SearchBar → filtra por nombre/apellido
    ├── FilterPanel → filtra por hospital, sexo, procedencia, estado, etc.
    ├── ResultList → muestra tarjetas de resultados
    ├── ResultCard → resumen de persona
    └── PersonDetail → modal con datos completos
```

**Flujo de datos:**
1. Usuario abre la página → se llama a `/api/sheet`
2. API Route consulta Google Sheets con API Key (servidor)
3. Se devuelve JSON con todos los registros
4. React almacena en estado y renderiza
5. Búsquedas y filtros operan client-side (sin llamadas adicionales)
6. Auto-refresh cada 30 minutos (opcional)

## Estructura del Proyecto

```
src/
├── app/
│   ├── page.tsx              # Página principal (buscador + resultados)
│   ├── layout.tsx            # Layout raíz con metadatos
│   ├── globals.css           # Tailwind directives
│   └── api/
│       └── sheet/
│           └── route.ts      # GET /api/sheet → datos del Google Sheet
├── components/
│   ├── SearchBar.tsx         # Input + botón de búsqueda
│   ├── FilterPanel.tsx       # Panel colapsable con filtros
│   ├── ResultCard.tsx        # Tarjeta individual
│   ├── ResultList.tsx        # Grid de tarjetas
│   ├── PersonDetailModal.tsx # Modal con detalle completo
│   ├── StatsBar.tsx          # Contadores (ej: "1,234 personas")
│   └── Layout.tsx            # Header/Footer
├── lib/
│   ├── sheet.ts             # Función fetchSheet() que llama a /api/sheet
│   └── types.ts             # Interfaces TypeScript
├── hooks/
│   └── useSheetData.ts      # Hook personalizado para datos + filtros
```

## Tipos de Datos

```typescript
interface Person {
  apellido: string
  nombre: string
  cedula: string
  edad: string
  menor: string        // "S" | "N"
  sexo: string         // "M" | "F"
  hospital: string
  area: string
  pisoCama: string
  procedencia: string
  diagnostico: string
  estado: string       // Ingreso, Traslado, Alta, etc.
  fechaReg: string
  hora: string
  familiar: string
  fuente: string
  comentarios: string
}
```

## Diseño de UI

### Página principal (única pantalla)
- **Header:** Título "Buscador de Personas — Terremoto Venezuela" + StatsBar
- **SearchBar:** Input de búsqueda con icono de lupa. Busca simultáneamente en nombre y apellido
- **FilterPanel:** Botón "Filtros" que despliega opciones:
  - Hospital/Centro (select)
  - Sexo (M/F)
  - Procedencia (select)
  - Estado/Condición (select)
  - Menor de edad (checkbox)
- **ResultList:** Grid de tarjetas (2 columnas en desktop, 1 en móvil)
- **ResultCard:** Apellido, Nombre, Edad, Hospital, Área, Estado
- **PersonDetailModal:** Al hacer clic en una tarjeta, modal con todos los campos

### Responsive
- Mobile-first con Tailwind
- Filtros colapsables en móvil
- Modal a pantalla completa en móvil

### Paleta de colores
- Fondo: blanco/gris claro
- Acento: azul (#2563eb)
- Estados: verde (localizado), amarillo (en hospital), rojo (crítico)
- Texto: gray-900

## API Route (/api/sheet)

```
GET /api/sheet
Response: { data: Person[], updatedAt: string }

Cache:
- Cache-Control: public, s-maxage=300, stale-while-revalidate=60
- En memoria: refetch each 5 min
```

## Variables de Entorno

```
GOOGLE_SHEETS_API_KEY=AIza...
SHEET_ID=15gUXyoBjsZK8RlixGotv635uY4t1m5Wu
SHEET_RANGE=A:Q
```

## Performance

- Carga inicial: descarga completa del sheet (~1-2s)
- Búsquedas: instantáneas (client-side filter)
- Debounce en el input de búsqueda (300ms)
- Cache en API Route para reducir llamadas a Google

## Próximos Pasos (post-MVP)

- PWA para instalación en móvil
- Compartir resultado por WhatsApp
- Modo offline con Service Worker
- Actualización periódica automática (cada 30 min)

---

**Nota:** Este diseño asume que el sheet está compartido públicamente (cualquiera con el link puede leer).
