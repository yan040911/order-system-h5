import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Category } from '../../types'
import AdminNav from './AdminNav'

export default function AdminCategories() {
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('🍽️')

  const load = async () => {
    if (!supabase) return
    const { data } = await supabase.from('categories').select('*').order('sort')
    setCats((data as Category[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const add = async () => {
    if (!supabase || !name.trim()) return
    await supabase
      .from('categories')
      .insert({ name: name.trim(), icon: icon.trim() || '🍽️', sort: cats.length + 1 })
    setName('')
    setIcon('🍽️')
    load()
  }

  const del = async (id: string) => {
    if (!supabase) return
    if (!confirm('删除分类会同时下架其下菜品，确定？')) return
    await supabase.from('categories').delete().eq('id', id)
    load()
  }

  return (
    <div className="flex min-h-full flex-col">
      <AdminNav />
      <div className="px-5 pb-1 pt-4 text-xl font-bold text-terracotta">📂 分类管理</div>
      <div className="flex-1 space-y-2 px-5 pb-10 pt-2">
        {loading ? (
          <div className="py-10 text-center text-muted">加载中…</div>
        ) : (
          cats.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-2xl bg-white p-3 shadow-soft"
            >
              <div className="text-ink">
                {c.icon} {c.name}
              </div>
              <button onClick={() => del(c.id)} className="text-sm text-red-400">
                删除
              </button>
            </div>
          ))
        )}
        <div className="mt-3 flex gap-2 rounded-2xl bg-white p-3 shadow-soft">
          <input
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="w-12 rounded-xl border border-warm bg-cream px-2 py-2 text-center outline-none"
          />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="新分类名"
            className="flex-1 rounded-xl border border-warm bg-cream px-3 py-2 outline-none focus:border-accent"
          />
          <button onClick={add} className="rounded-full bg-accent px-4 py-2 text-sm text-white">
            添加
          </button>
        </div>
      </div>
    </div>
  )
}
