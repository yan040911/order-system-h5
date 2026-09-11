import { useCart } from '../context/CartContext'

// 悬浮购物车条，位于底部导航之上
export default function CartBar({ onClick }: { onClick: () => void }) {
  const { count, lines } = useCart()
  if (count === 0) return null
  return (
    <button
      onClick={onClick}
      style={{ bottom: 'calc(env(safe-area-inset-bottom) + 4.5rem)' }}
      className="fixed bottom-20 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-terracotta px-5 py-3 text-white shadow-soft transition active:scale-95"
    >
      <span className="text-lg">🛒</span>
      <span className="text-sm">已选 {count} 件</span>
      <span className="rounded-full bg-white/25 px-2 text-xs">{lines.length} 种</span>
    </button>
  )
}
