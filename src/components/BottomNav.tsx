import { NavLink } from 'react-router-dom'

function item(to: string, icon: string, label: string) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-1 flex-col items-center py-2 text-xs ${
          isActive ? 'text-accent' : 'text-muted'
        }`
      }
    >
      <span className="text-xl">{icon}</span>
      {label}
    </NavLink>
  )
}

export default function BottomNav() {
  return (
    // mt-auto + 父级 min-h-screen 保证导航栏永远贴在视口底部
    <nav className="z-10 mt-auto flex shrink-0 border-t border-warm bg-white/90 backdrop-blur">
      {item('/', '🍽️', '点餐')}
      {item('/orders', '📋', '我的订单')}
      {item('/reviews', '⭐', '评价')}
      {item('/admin', '⚙️', '管理')}
    </nav>
  )
}
