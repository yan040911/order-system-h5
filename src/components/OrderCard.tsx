import type { Order, OrderStatus } from '../types'
import { STATUS_LABEL } from '../types'

const STATUS_COLOR: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  preparing: 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-200 text-gray-500',
}

export default function OrderCard({
  order,
  onUpdate,
}: {
  order: Order
  onUpdate: (id: string, status: OrderStatus) => void
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-ink">{order.order_no}</div>
        <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_COLOR[order.status]}`}>
          {STATUS_LABEL[order.status]}
        </span>
      </div>
      <div className="mt-1 text-xs text-muted">
        桌号 {order.table_no || '—'} · {new Date(order.created_at).toLocaleTimeString('zh-CN')}
      </div>
      <div className="mt-2 space-y-1">
        {order.items.map((it, i) => (
          <div key={i} className="flex justify-between text-sm text-ink">
            <span>
              {it.name} × {it.qty}
              {it.note ? <span className="text-terracotta">（{it.note}）</span> : null}
            </span>
          </div>
        ))}
      </div>
      {order.note && <div className="mt-2 text-xs text-terracotta">备注：{order.note}</div>}
      <div className="mt-3 flex flex-wrap gap-2">
        {order.status === 'pending' && (
          <button
            onClick={() => onUpdate(order.id, 'preparing')}
            className="rounded-full bg-blue-500 px-3 py-1 text-xs text-white"
          >
            开始制作
          </button>
        )}
        {order.status === 'preparing' && (
          <button
            onClick={() => onUpdate(order.id, 'done')}
            className="rounded-full bg-green-500 px-3 py-1 text-xs text-white"
          >
            完成出餐
          </button>
        )}
        {order.status !== 'cancelled' && order.status !== 'done' && (
          <button
            onClick={() => onUpdate(order.id, 'cancelled')}
            className="rounded-full bg-gray-300 px-3 py-1 text-xs text-gray-700"
          >
            取消
          </button>
        )}
      </div>
    </div>
  )
}
