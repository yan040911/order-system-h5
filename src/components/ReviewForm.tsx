import { useEffect, useState } from 'react'
import { upsertReview, deleteReview } from '../lib/reviews'
import type { Review, OrderItem } from '../types'
import StarRating from './StarRating'

export default function ReviewForm({
  open,
  orderId,
  orderNo,
  items,
  existing,
  onClose,
  onSaved,
}: {
  open: boolean
  orderId: string
  orderNo: string
  items: OrderItem[]
  existing: Review | null
  onClose: () => void
  onSaved?: () => void
}) {
  const [dish, setDish] = useState(5)
  const [service, setService] = useState(5)
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // 每次打开时若有现成评价，回填
  useEffect(() => {
    if (!open) return
    if (existing) {
      setDish(existing.dish_rating)
      setService(existing.service_rating)
      setComment(existing.comment || '')
    } else {
      setDish(5)
      setService(5)
      setComment('')
    }
  }, [open, existing])

  if (!open) return null

  const submit = async () => {
    setSaving(true)
    const r = await upsertReview({
      order_id: orderId,
      order_no: orderNo,
      items,
      dish_rating: dish,
      service_rating: service,
      comment,
    })
    setSaving(false)
    if (r) {
      onSaved?.()
      onClose()
    } else {
      alert('保存失败，请稍后再试')
    }
  }

  const remove = async () => {
    if (!existing) return
    if (!confirm('确定删除这条评价？删除后无法恢复')) return
    setDeleting(true)
    const ok = await deleteReview(existing.id)
    setDeleting(false)
    if (ok) {
      onSaved?.()
      onClose()
    } else {
      alert('删除失败，请稍后再试')
    }
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-end bg-black/40"
      onClick={onClose}
    >
      <div
        className="mx-auto w-full max-w-md rounded-t-3xl bg-cream p-5 pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="text-lg font-bold text-terracotta">
            ⭐ {existing ? '修改评价' : '餐后评价'}
          </div>
          <button onClick={onClose} className="text-muted">
            ✕
          </button>
        </div>

        <div className="mb-1 text-xs text-muted">订单 {orderNo}</div>
        <div className="mb-3 text-xs text-muted">
          所点菜品：
          {items.map((it, i) => (
            <span key={i}>
              {it.name} × {it.qty}
              {i < items.length - 1 ? '、' : ''}
            </span>
          ))}
        </div>

        <div className="mb-4 rounded-2xl bg-white p-4 shadow-soft">
          <div className="mb-2 flex items-center justify-between">
            <div className="font-medium text-ink">菜品满意度</div>
            <div className="text-xs text-muted">{dish} / 5</div>
          </div>
          <StarRating value={dish} onChange={setDish} size={28} />
        </div>

        <div className="mb-4 rounded-2xl bg-white p-4 shadow-soft">
          <div className="mb-2 flex items-center justify-between">
            <div className="font-medium text-ink">服务满意度</div>
            <div className="text-xs text-muted">{service} / 5</div>
          </div>
          <StarRating value={service} onChange={setService} size={28} />
        </div>

        <div className="mb-4 rounded-2xl bg-white p-4 shadow-soft">
          <div className="mb-2 font-medium text-ink">写个评论（可选）</div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={300}
            rows={3}
            placeholder="说说你的感受，对家人很重要哦～"
            className="w-full resize-none rounded-xl bg-warm/40 p-2 text-sm text-ink outline-none placeholder:text-muted focus:bg-warm/70"
          />
          <div className="mt-1 text-right text-[10px] text-muted">{comment.length} / 300</div>
        </div>

        <div className="flex gap-2">
          {existing && (
            <button
              onClick={remove}
              disabled={deleting || saving}
              className="rounded-full bg-warm px-4 py-3 text-ink disabled:opacity-50"
            >
              {deleting ? '删除中…' : '删除评论'}
            </button>
          )}
          <button
            onClick={submit}
            disabled={saving || deleting}
            className="flex-1 rounded-full bg-terracotta py-3 font-medium text-white disabled:opacity-50"
          >
            {saving ? '保存中…' : existing ? '保存修改' : '提交评价'}
          </button>
          <button
            onClick={onClose}
            className="rounded-full bg-warm px-4 py-3 text-ink"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}
