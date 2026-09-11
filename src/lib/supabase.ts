import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/** 是否已正确配置 Supabase（缺任意一项即为未配置，前端会提示） */
export const isConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = isConfigured
  ? createClient(url!, anonKey!)
  : null

/** 管理端登录密码（环境变量优先，缺省回退到默认） */
export const ADMIN_PWD = import.meta.env.VITE_ADMIN_PWD || 'xiaoyu2026'
