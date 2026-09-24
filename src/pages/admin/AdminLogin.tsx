import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ADMIN_PWD } from '../../lib/supabase'
import Header from '../../components/Header'

export default function AdminLogin() {
  const [pwd, setPwd] = useState('')
  const [err, setErr] = useState(false)
  const nav = useNavigate()

  const submit = () => {
    if (pwd === ADMIN_PWD) {
      localStorage.setItem('xiaoyu_admin', '1')
      nav('/admin/dashboard')
    } else {
      setErr(true)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="管理后台" subtitle="家庭点餐管理" />
      <div className="flex-1 px-6 pb-10 pt-6">
        <div className="rounded-2xl bg-white p-5 shadow-soft">
          <div className="mb-3 text-sm text-muted">请输入管理密码</div>
          <input
            type="password"
            value={pwd}
            onChange={(e) => {
              setPwd(e.target.value)
              setErr(false)
            }}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="管理密码"
            className="w-full rounded-xl border border-warm bg-cream px-3 py-2 outline-none focus:border-accent"
          />
          {err && <div className="mt-2 text-xs text-red-500">密码错误</div>}
          <button
            onClick={submit}
            className="mt-4 w-full rounded-full bg-terracotta py-3 font-medium text-white"
          >
            进入
          </button>
          <div className="mt-3 text-center text-xs text-muted">
            管理密码 03050911（可在 .env.local 的 VITE_ADMIN_PWD 修改）
          </div>
        </div>

        {/* 返回主页 / 点餐 按钮（登录页独立于顶部 AdminNav，需自带出口） */}
        <div className="mt-6">
          <Link
            to="/"
            className="block w-full rounded-full bg-warm py-3 text-center font-medium text-ink shadow-soft active:scale-95"
          >
            ← 返回主页 · 去点餐
          </Link>
        </div>
      </div>
    </div>
  )
}
