import { Link, useNavigate } from 'react-router-dom'

export default function AdminNav() {
  const nav = useNavigate()
  const logout = () => {
    localStorage.removeItem('xiaoyu_admin')
    nav('/admin')
  }
  return (
    <div className="flex items-center gap-2 border-b border-warm bg-white/90 px-3 py-2 text-xs">
      {/* 显眼的主页跳转按钮 */}
      <Link
        to="/"
        className="rounded-full bg-accent px-3 py-1 font-medium text-white shadow-sm active:scale-95"
      >
        ← 返回主页
      </Link>
      <Link to="/admin/dashboard" className="rounded-full bg-warm px-3 py-1 text-ink">
        看板
      </Link>
      <Link to="/admin/dishes" className="rounded-full bg-warm px-3 py-1 text-ink">
        菜品
      </Link>
      <Link to="/admin/categories" className="rounded-full bg-warm px-3 py-1 text-ink">
        分类
      </Link>
      <button onClick={logout} className="ml-auto text-muted">
        退出
      </button>
    </div>
  )
}
