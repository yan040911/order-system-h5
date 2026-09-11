import type { Category } from '../types'

export default function CategoryTabs({
  categories,
  active,
  onChange,
}: {
  categories: Category[]
  active: string
  onChange: (id: string) => void
}) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 py-2">
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition ${
            active === c.id ? 'bg-accent text-white' : 'bg-white text-ink'
          }`}
        >
          {c.icon} {c.name}
        </button>
      ))}
    </div>
  )
}
