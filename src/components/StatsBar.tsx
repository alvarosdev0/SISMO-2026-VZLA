interface StatsBarProps {
  total: number
  filtered: number
}

export function StatsBar({ total, filtered }: StatsBarProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">{total.toLocaleString()}</span>
          <span className="text-gray-500">personas registradas</span>
        </div>
        {total !== filtered && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-blue-600">{filtered.toLocaleString()}</span>
            <span className="text-gray-500">coinciden con tu búsqueda</span>
          </div>
        )}
      </div>
    </div>
  )
}
