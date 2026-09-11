import { useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../../lib/supabase'
import type { Category, Dish } from '../../types'

interface FormState {
  id?: string
  name: string
  category_id: string
  description: string
  price: string
  tags: string
  image_url: string
  status: 'on' | 'off'
}

const inputCls =
  'w-full rounded-xl border border-warm bg-white px-3 py-2 text-sm outline-none focus:border-accent'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-3">
      <div className="mb-1 text-xs text-muted">{label}</div>
      {children}
    </div>
  )
}

export default function AdminDishes() {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<FormState | null>(null)

  const load = async () => {
    if (!supabase) return
    const [{ data: d }, { data: c }] = await Promise.all([
      supabase.from('dishes').select('*').order('sort'),
      supabase.from('categories').select('*').order('sort'),
    ])
    setDishes((d as Dish[]) || [])
    setCats((c as Category[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const openNew = () =>
    setEditing({
      name: '',
      category_id: cats[0]?.id || '',
      description: '',
      price: '',
      tags: '',
      image_url: '',
      status: 'on',
    })

  const openEdit = (d: Dish) =>
    setEditing({
      id: d.id,
      name: d.name,
      category_id: d.category_id,
      description: d.description,
      price: String(d.price),
      tags: (d.tags || []).join(','),
      image_url: d.image_url,
      status: d.status,
    })

  const save = async () => {
    if (!supabase || !editing) return
    const payload = {
      name: editing.name,
      category_id: editing.category_id,
      description: editing.description,
      price: Number(editing.price) || 0,
      tags: editing.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      image_url: editing.image_url,
      status: editing.status,
    }
    if (editing.id) {
      await supabase.from('dishes').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('dishes').insert({ ...payload, sort: dishes.length + 1 })
    }
    setEditing(null)
    load()
  }

  const del = async (id: string) => {
    if (!supabase) return
    if (!confirm('确定删除该菜品？')) return
    await supabase.from('dishes').delete().eq('id', id)
    load()
  }

  return (
    <div className="flex min-h-full flex-col">
      <AdminNav />
      <div className="flex items-center justify-between px-5 pb-1 pt-4">
        <div className="text-xl font-bold text-terracotta">🍳 菜品管理</div>
        <button onClick={openNew} className="rounded-full bg-accent px-3 py-1 text-sm text-white">
          + 新增
        </button>
      </div>
      <div className="flex-1 space-y-2 px-5 pb-10 pt-2">
        {loading ? (
          <div className="py-10 text-center text-muted">加载中…</div>
        ) : (
          dishes.map((d) => (
            <div key={d.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-soft">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-warm flex items-center justify-center">
                {d.image_url ? (
                  <img src={d.image_url} alt={d.name} className="h-full w-full object-cover" />
                ) : (
                  '🍽️'
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium text-ink">
                  {d.name} <span className="text-xs text-muted">¥{d.price}</span>
                </div>
                <div className="text-xs text-muted">{d.status === 'on' ? '在售' : '下架'}</div>
              </div>
              <button onClick={() => openEdit(d)} className="text-sm text-accent">
                编辑
              </button>
              <button onClick={() => del(d.id)} className="text-sm text-red-400">
                删
              </button>
            </div>
          ))
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-30 flex bg-black/40" onClick={() => setEditing(null)}>
          <div
            className="mt-auto max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-cream p-5 pb-safe"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 text-lg font-bold text-terracotta">
              {editing.id ? '编辑菜品' : '新增菜品'}
            </div>
            <Field label="名称">
              <input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="分类">
              <select
                value={editing.category_id}
                onChange={(e) => setEditing({ ...editing, category_id: e.target.value })}
                className={inputCls}
              >
                {cats.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="价格（仅管理端可见，顾客端不显示）">
              <input
                value={editing.price}
                inputMode="decimal"
                onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="简介">
              <input
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="标签（逗号分隔）">
              <input
                value={editing.tags}
                onChange={(e) => setEditing({ ...editing, tags: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="图片 URL">
              <input
                value={editing.image_url}
                onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="状态">
              <select
                value={editing.status}
                onChange={(e) => setEditing({ ...editing, status: e.target.value as 'on' | 'off' })}
                className={inputCls}
              >
                <option value="on">在售</option>
                <option value="off">下架</option>
              </select>
            </Field>
            <button
              onClick={save}
              className="mt-4 w-full rounded-full bg-terracotta py-3 font-medium text-white"
            >
              保存
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
