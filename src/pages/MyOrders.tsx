import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, isConfigured } from '../lib/supabase'
import type { Order } from '../types'
import { getMyOrders } from '../lib/myOrders'
import { useReviewByOrderId } from '../lib/reviews'
import Header from '../components/Header'
import OrderCard from '../components/OrderCard'
import ReviewForm from '../components/ReviewForm'
import BottomNav from '../components/BottomNav'
import ConfigMissing from '../components/ConfigMissing'

const SITE_URL = 'https://yan040911.github.io/order-system-h5/'

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [shareOrder, setShareOrder] = useState<Order | null>(null)
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null)
  const nos = getMyOrders()

  useEffect(() => {
    if (!supabase) return
    let alive = true
    ;(async () => {
      if (nos.length === 0) {
        setLoading(false)
        return
      }
      const { data } = await supabase
        .from('orders')
        .select('*')
        .in('order_no', nos)
        .order('created_at', { ascending: false })
      if (alive) {
        setOrders((data as Order[]) || [])
        setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [nos.length])

  if (!isConfigured) {
    return (
      <div className="flex min-h-full flex-col">
        <Header />
        <ConfigMissing />
        <BottomNav />
      </div>
    )
  }

  const buildShareText = (o: Order) => {
    const items = o.items
      .map((it) => `${it.name} × ${it.qty}${it.note ? `（${it.note}）` : ''}`)
      .join('、')
    return `【小鱼家点餐 · 催一下小言】\n订单号：${o.order_no}\n菜品：${items}\n状态：${o.status === 'preparing' ? '制作中' : '待制作'}\n麻烦尽快出餐哦～🍳\n${SITE_URL}`
  }

  const doShare = async (o: Order) => {
    const text = buildShareText(o)
    try {
      if (navigator.share) {
        await navigator.share({ title: '催一下小言', text })
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text)
        alert('已复制催单文字，去粘贴给厨房吧～')
      }
    } catch {
      /* 用户取消分享，忽略 */
    }
    setShareOrder(null)
  }

  return (
    <div className="flex min-h-full flex-col">
      <Header title="我的订单" subtitle="查看已点餐品状态" />
      <div className="flex-1 px-5 pb-24 pt-2">
        {loading ? (
          <div className="py-10 text-center text-muted">加载中…</div>
        ) : orders.length === 0 ? (
          <div className="py-10 text-center text-muted">
            还没有订单哦～
            <br />
            <Link to="/" className="mt-2 inline-block text-accent">
              去点餐 →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <OrderCard
                key={o.id}
                order={o}
                customer
                onShare={setShareOrder}
                onReview={setReviewOrder}
              />
            ))}
          </div>
        )}
      </div>

      {/* 催一下小言 · 分享页 */}
      {shareOrder && (
        <div
          className="fixed inset-0 z-40 flex items-end bg-black/40"
          onClick={() => setShareOrder(null)}
        >
          <div
            className="mx-auto w-full max-w-md rounded-t-3xl bg-cream p-5 pb-safe"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="text-lg font-bold text-terracotta">催一下小言 🍳</div>
              <button onClick={() => setShareOrder(null)} className="text-muted">
                ✕
              </button>
            </div>
            <pre className="mb-4 whitespace-pre-wrap rounded-2xl bg-white p-3 text-xs leading-relaxed text-ink">
              {buildShareText(shareOrder)}
            </pre>
            <div className="flex gap-2">
              <button
                onClick={() => doShare(shareOrder)}
                className="flex-1 rounded-full bg-terracotta py-3 font-medium text-white"
              >
                分享到微信 / 其他应用
              </button>
              <button
                onClick={() => setShareOrder(null)}
                className="rounded-full bg-warm px-4 py-3 text-ink"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 评价弹窗：拉取本订单已存在的评价（如有）回填 */}
      {reviewOrder && (
        <ReviewModal
          order={reviewOrder}
          open={!!reviewOrder}
          onClose={() => setReviewOrder(null)}
        />
      )}

      <BottomNav />
    </div>
  )
}

/** 把评价弹窗与「拉取该订单已有评价」组合在一起 */
function ReviewModal({
  order,
  open,
  onClose,
}: {
  order: Order
  open: boolean
  onClose: () => void
}) {
  const { review } = useReviewByOrderId(open ? order.id : null)
  return (
    <ReviewForm
      open={open}
      orderId={order.id}
      orderNo={order.order_no}
      items={order.items}
      existing={review}
      onClose={onClose}
    />
  )
}
