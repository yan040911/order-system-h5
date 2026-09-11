import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import type { Order, OrderStatus } from '../../types'
import OrderCard from '../../components/OrderCard'
import AdminNav from './AdminNav'

const FILTERS: { key: OrderStatus | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待制作' },
  { key: 'preparing', label: '制作中' },
  { key: 'done', label: '已完成' },
]

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) return
    let alive = true
    const load = async () => {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      if (alive) {
        setOrders((data as Order[]) || [])
        setLoading(false)
      }
    }
    load()
    // 实时订阅：订单有变化自动刷新（无需轮询）
    const ch = supabase
      .channel('orders-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => load())
      .subscribe()
    return () => {
      alive = false
      supabase.removeChannel(ch)
    }
  }, [])

  const onUpdate = async (id: string, status: OrderStatus) => {
    if (!supabase) return
    await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
  }

  const shown = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  return (
    <div className="flex min-h-full flex-col">
      <AdminNav />
      <div className="flex items-center justify-between px-5 pb-1 pt-4">
        <div className="text-xl font-bold text-terracotta">📡 实时订单</div>
        <Link to="/admin/dishes" className="text-sm text-accent">
          菜品管理 →
        </Link>
      </div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 py-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs ${
              filter === f.key ? 'bg-accent text-white' : 'bg-white text-ink'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="flex-1 space-y-3 px-5 pb-10 pt-1">
        {loading ? (
          <div className="py-10 text-center text-muted">连接中…</div>
        ) : shown.length === 0 ? (
          <div className="py-10 text-center text-muted">暂无订单</div>
        ) : (
          shown.map((o) => <OrderCard key={o.id} order={o} onUpdate={onUpdate} />)
        )}
      </div>
    </div>
  )
}
