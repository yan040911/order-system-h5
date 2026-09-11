import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Dish } from '../types'

export interface CartLine {
  dish: Dish
  qty: number
  note: string
}

interface CartCtx {
  lines: CartLine[]
  add: (dish: Dish, note?: string) => void
  setQty: (dishId: string, qty: number) => void
  setNote: (dishId: string, note: string) => void
  remove: (dishId: string) => void
  clear: () => void
  count: number
}

const Ctx = createContext<CartCtx | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])

  const add = (dish: Dish, note = '') => {
    setLines((prev) => {
      const found = prev.find((l) => l.dish.id === dish.id && l.note === note)
      if (found) {
        return prev.map((l) => (l === found ? { ...l, qty: l.qty + 1 } : l))
      }
      return [...prev, { dish, qty: 1, note }]
    })
  }

  const setQty = (dishId: string, qty: number) =>
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.dish.id !== dishId)
        : prev.map((l) => (l.dish.id === dishId ? { ...l, qty } : l)),
    )

  const setNote = (dishId: string, note: string) =>
    setLines((prev) => prev.map((l) => (l.dish.id === dishId ? { ...l, note } : l)))

  const remove = (dishId: string) =>
    setLines((prev) => prev.filter((l) => l.dish.id !== dishId))

  const clear = () => setLines([])

  const count = lines.reduce((s, l) => s + l.qty, 0)

  return (
    <Ctx.Provider value={{ lines, add, setQty, setNote, remove, clear, count }}>
      {children}
    </Ctx.Provider>
  )
}

export function useCart() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCart must be used within CartProvider')
  return c
}
