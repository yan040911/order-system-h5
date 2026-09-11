import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

export default function RequireAdmin({ children }: { children: ReactNode }) {
  const ok = typeof window !== 'undefined' && localStorage.getItem('xiaoyu_admin') === '1'
  if (!ok) return <Navigate to="/admin" replace />
  return <>{children}</>
}
