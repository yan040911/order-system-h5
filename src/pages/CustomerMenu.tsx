import { useEffect, useState } from 'react'
import { supabase, isConfigured } from '../lib/supabase'
import type { Category, Dish } from '../types'
import { useCart } from '../context/CartContext'
import Header from '../components/Header'
import CategoryTabs from '../components/CategoryTabs'
import DishCard from '../components/DishCard'
import CartBar from '../components/CartBar'
import CheckoutSheet from '../components/CheckoutSheet'
import BottomNav from '../components/BottomNav'
import ConfigMissing from '../components/ConfigMissing'

export default function CustomerMenu() {
  const [categories, setCategories] = useState<Category[]>([])
  const [dishes, setDishes] = useState<Dish[]>([])
  const [active, setActive] = useState('')
  const [loading, setLoading] = useState(true)
  const [checkout, setCheckout] = useState(false)
  const { add } = useCart()

  useEffect(() => {
    if (!supabase) return
    let alive = true
    ;(async () => {
      const [{ data: cats }, { data: ds }] = await Promise.all([
        supabase.from('categories').select('*').order('sort'),
        supabase.from('dishes').select('*').order('sort'),
      ])
      if (!alive) return
      const c = (cats as Category[]) || []
      const d = (ds as Dish[]) || []
      setCategories(c)
      setDishes(d)
      setActive(c[0]?.id || '')
      setLoading(false)
    })()
    return () => {
      alive = false
    }
  }, [])

  if (!isConfigured) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <ConfigMissing />
        <BottomNav />
      </div>
    )
  }

  const visible = dishes.filter((d) => d.category_id === active && d.status === 'on')

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      {loading ? (
        <div className="px-5 py-10 text-center text-muted">菜单加载中…</div>
      ) : (
        <>
          <CategoryTabs categories={categories} active={active} onChange={setActive} />
          <div className="flex-1 space-y-3 px-5 pb-28 pt-1">
            {visible.length === 0 ? (
              <div className="py-10 text-center text-muted">该分类暂无菜品</div>
            ) : (
              visible.map((d) => <DishCard key={d.id} dish={d} onAdd={add} />)
            )}
          </div>
        </>
      )}
      <CartBar onClick={() => setCheckout(true)} />
      <CheckoutSheet open={checkout} onClose={() => setCheckout(false)} />
      <BottomNav />
    </div>
  )
}
