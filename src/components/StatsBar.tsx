interface StatsBarProps {
  total: number
  filtered: number
  updatedAt: string | null
}

export function StatsBar({ total, filtered, updatedAt }: StatsBarProps) {
  const formatted = updatedAt
    ? new Date(updatedAt).toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-800 p-4 mb-4">
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900 dark:text-gray-100">{total.toLocaleString()}</span>
          <span className="text-gray-500 dark:text-gray-400">personas registradas</span>
        </div>
        {total !== filtered && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-blue-600 dark:text-blue-400">{filtered.toLocaleString()}</span>
            <span className="text-gray-500 dark:text-gray-400">coinciden con tu búsqueda</span>
          </div>
        )}
      </div>
      {formatted && (
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          Última actualización de los datos: {formatted}
        </p>
      )}
    </div>
  )
}
