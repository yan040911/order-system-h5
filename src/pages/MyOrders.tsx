import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, isConfigured } from '../lib/supabase'
import type { Order, OrderStatus } from '../types'
import { getMyOrders } from '../lib/myOrders'
import Header from '../components/Header'
import OrderCard from '../components/OrderCard'
import BottomNav from '../components/BottomNav'
import ConfigMissing from '../components/ConfigMissing'

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
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

  const onUpdate = async (id: string, status: OrderStatus) => {
    if (!supabase) return
    await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
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
              <OrderCard key={o.id} order={o} onUpdate={onUpdate} />
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
