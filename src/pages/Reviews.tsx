import { Link } from 'react-router-dom'
import { useReviews } from '../lib/reviews'
import { ShopRatingPanel } from '../components/ShopRating'
import StarRating from '../components/StarRating'
import ConfigMissing from '../components/ConfigMissing'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import { isConfigured } from '../lib/supabase'

function timeAgo(s: string) {
  const t = new Date(s).getTime()
  const diff = Math.max(1, Math.floor((Date.now() - t) / 1000))
  if (diff < 60) return `${diff} 秒前`
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} 天前`
  return new Date(s).toLocaleDateString('zh-CN')
}

export default function Reviews() {
  const { reviews, loading } = useReviews()
  if (!isConfigured) {
    return (
      <div className="flex min-h-full flex-col">
        <Header />
        <ConfigMissing />
        <BottomNav />
      </div>
    )
  }
  return (
    <div className="flex min-h-full flex-col">
      <Header title="大家怎么说" subtitle="顾客真实评价" />
      <div className="flex-1 space-y-3 px-5 pb-24 pt-2">
        <ShopRatingPanel />
        {loading ? (
          <div className="py-10 text-center text-muted">加载评价中…</div>
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-center text-muted shadow-soft">
            🌱 还没有顾客评价
            <br />
            <span className="text-xs">完成一单后去「我的订单」评价吧</span>
          </div>
        ) : (
          reviews.map((rv) => (
            <div key={rv.id} className="rounded-2xl bg-white p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-ink">
                  <span className="font-mono text-xs text-muted">{rv.order_no}</span>
                  <span className="rounded-full bg-warm/40 px-2 py-0.5 text-[10px] text-terracotta">
                    {timeAgo(rv.created_at)}
                  </span>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 rounded-xl bg-warm/40 px-2 py-1.5">
                  <span className="text-[11px] text-muted">菜品</span>
                  <StarRating value={rv.dish_rating} readOnly size={12} />
                  <span className="ml-auto text-xs font-bold text-ink">
                    {Number(rv.dish_rating).toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-warm/40 px-2 py-1.5">
                  <span className="text-[11px] text-muted">服务</span>
                  <StarRating value={rv.service_rating} readOnly size={12} />
                  <span className="ml-auto text-xs font-bold text-ink">
                    {Number(rv.service_rating).toFixed(1)}
                  </span>
                </div>
              </div>
              {rv.comment && (
                <div className="mt-2 rounded-xl bg-cream p-2 text-sm text-ink">
                  {rv.comment}
                </div>
              )}
              {rv.items?.length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-muted">
                    查看本单所点菜品（{rv.items.length} 种）
                  </summary>
                  <div className="mt-1 space-y-0.5 pl-1 text-xs text-ink">
                    {rv.items.map((it, i) => (
                      <div key={i}>
                        • {it.name} × {it.qty}
                        {it.note ? (
                          <span className="text-terracotta">（{it.note}）</span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          ))
        )}
        <div className="text-center text-xs text-muted">
          <Link to="/" className="text-accent">
            ← 返回点餐
          </Link>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
