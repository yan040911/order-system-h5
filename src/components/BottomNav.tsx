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
    // sticky bottom-0：无论页面多长，导航栏始终贴着视口底部
    // 短页面：因父级 flex min-h-screen + mt-auto 已在视口底部
    // 长页面：sticky 把它钉在视口底部，滚动时始终可见
    // pb-[env(safe-area-inset-bottom)]：iPhone 底部小白条 / Home Indicator 避让
    <nav className="sticky bottom-0 z-10 mt-auto flex shrink-0 border-t border-warm bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      {item('/', '🍽️', '点餐')}
      {item('/orders', '📋', '我的订单')}
      {item('/reviews', '⭐', '评价')}
      {item('/admin', '⚙️', '管理')}
    </nav>
  )
}
