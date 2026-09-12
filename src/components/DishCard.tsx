import type { Dish } from '../types'

// 顾客端菜品卡：刻意不展示价格（价格仅管理端可见）
export default function DishCard({
  dish,
  onAdd,
}: {
  dish: Dish
  onAdd: (d: Dish) => void
}) {
  if (dish.status === 'off') return null
  return (
    <div className="flex gap-3 rounded-2xl bg-white p-3 shadow-soft">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-warm flex items-center justify-center text-3xl">
        {dish.image_url ? dish.image_url : '🍽️'}
      </div>
      <div className="flex flex-1 flex-col">
        <div className="font-semibold text-ink">{dish.name}</div>
        {dish.description && (
          <div className="mt-1 line-clamp-2 text-xs text-muted">{dish.description}</div>
        )}
        {dish.tags?.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {dish.tags.map((t) => (
              <span key={t} className="rounded-full bg-peach px-2 py-0.5 text-[10px] text-terracotta">
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto pt-2">
          <button
            onClick={() => onAdd(dish)}
            className="rounded-full bg-accent px-4 py-1 text-sm font-medium text-white transition active:scale-95"
          >
            加入
          </button>
        </div>
      </div>
    </div>
  )
}
