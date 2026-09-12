import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabase'
import { saveMyOrder } from '../lib/myOrders'
import type { OrderItem } from '../types'

export default function CheckoutSheet({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { lines, setQty, setNote, clear, count } = useCart()
  const [globalNote, setGlobalNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  if (!open) return null

  const submit = async () => {
    if (!supabase || lines.length === 0) return
    setSubmitting(true)
    const items: OrderItem[] = lines.map((l) => ({
      dish_id: l.dish.id,
      name: l.dish.name,
      qty: l.qty,
      note: l.note || undefined,
    }))
    const order_no = 'XY' + Date.now().toString().slice(-8)
    const { data, error } = await supabase
      .from('orders')
      .insert({
        order_no,
        items,
        status: 'pending',
        note: globalNote.trim(),
      })
      .select('order_no')
      .single()
    setSubmitting(false)
    if (!error && data) {
      saveMyOrder((data as { order_no: string }).order_no)
      clear()
      setDone(true)
      setTimeout(() => {
        setDone(false)
        onClose()
      }, 1500)
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex bg-black/40" onClick={onClose}>
      <div
        className="mt-auto max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-cream p-5 pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="text-lg font-bold text-terracotta">确认订单</div>
          <button onClick={onClose} className="text-muted">
            ✕
          </button>
        </div>
        {done ? (
          <div className="py-10 text-center text-green-600">✅ 下单成功，已通知厨房！</div>
        ) : (
          <>
            <div className="space-y-3">
              {lines.map((l) => (
                <div key={l.dish.id} className="rounded-2xl bg-white p-3 shadow-soft">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-ink">{l.dish.name}</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQty(l.dish.id, l.qty - 1)}
                        className="h-7 w-7 rounded-full bg-warm text-terracotta"
                      >
                        −
                      </button>
                      <span className="w-5 text-center">{l.qty}</span>
                      <button
                        onClick={() => setQty(l.dish.id, l.qty + 1)}
                        className="h-7 w-7 rounded-full bg-warm text-terracotta"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <input
                    value={l.note}
                    onChange={(e) => setNote(l.dish.id, e.target.value)}
                    placeholder="口味备注（可选）"
                    className="mt-2 w-full rounded-xl border border-warm bg-cream px-3 py-1.5 text-sm outline-none focus:border-accent"
                  />
                </div>
              ))}
            </div>
            <div className="mt-3">
              <input
                value={globalNote}
                onChange={(e) => setGlobalNote(e.target.value)}
                placeholder="整单备注（可选）"
                className="w-full rounded-xl border border-warm bg-white px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>
            <button
              onClick={submit}
              disabled={submitting || count === 0}
              className="mt-4 w-full rounded-full bg-terracotta py-3 font-medium text-white disabled:opacity-50"
            >
              {submitting ? '提交中…' : `提交订单（${count} 件）`}
            </button>
          </>
        )}
      </div>
    </div>
  )
}