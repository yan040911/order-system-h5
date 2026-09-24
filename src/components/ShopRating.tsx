import { Link } from 'react-router-dom'
import { useShopRating } from '../lib/reviews'
import StarRating from './StarRating'

// 首页左上角店铺平均分（实时订阅 reviews 表）
export default function ShopRatingBadge() {
  const r = useShopRating()
  if (r.count === 0) {
    return (
      <Link
        to="/reviews"
        className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs text-muted shadow-soft"
      >
        <span>⭐</span>
        <span>暂无评价</span>
      </Link>
    )
  }
  return (
    <Link
      to="/reviews"
      className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-soft"
    >
      <span className="text-base">⭐</span>
      <div className="flex items-baseline gap-1">
        <span className="text-base font-bold text-terracotta">
          {r.overall.toFixed(1)}
        </span>
        <span className="text-[10px] text-muted">/ 5</span>
      </div>
      <div className="hidden text-[10px] text-muted sm:block">
        菜 {r.dish.toFixed(1)} · 服 {r.service.toFixed(1)} · {r.count}评
      </div>
    </Link>
  )
}

// 评价板块页面用的"店铺总评分"卡片（更详细展示）
export function ShopRatingPanel() {
  const r = useShopRating()
  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft">
      <div className="flex items-center gap-3">
        <div className="text-4xl font-bold text-terracotta">
          {r.count === 0 ? '—' : r.overall.toFixed(1)}
        </div>
        <div className="flex-1">
          <div className="font-medium text-ink">店铺综合评分</div>
          {r.count > 0 && (
            <StarRating value={r.overall} readOnly size={16} />
          )}
          <div className="mt-1 text-xs text-muted">
            {r.count > 0 ? `基于 ${r.count} 条评价` : '还没有顾客评价'}
          </div>
        </div>
      </div>
      {r.count > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl bg-warm/40 p-2">
            <div className="mb-1 text-muted">菜品满意度（50%）</div>
            <div className="flex items-center gap-1">
              <span className="text-base font-bold text-ink">
                {r.dish.toFixed(1)}
              </span>
              <StarRating value={r.dish} readOnly size={12} />
            </div>
          </div>
          <div className="rounded-xl bg-warm/40 p-2">
            <div className="mb-1 text-muted">服务满意度（50%）</div>
            <div className="flex items-center gap-1">
              <span className="text-base font-bold text-ink">
                {r.service.toFixed(1)}
              </span>
              <StarRating value={r.service} readOnly size={12} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
