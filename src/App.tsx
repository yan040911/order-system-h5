import { Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import CustomerMenu from './pages/CustomerMenu'
import MyOrders from './pages/MyOrders'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminDishes from './pages/admin/AdminDishes'
import AdminCategories from './pages/admin/AdminCategories'
import RequireAdmin from './pages/admin/RequireAdmin'

export default function App() {
  return (
    <CartProvider>
      <div className="mx-auto flex min-h-full max-w-md flex-col bg-cream">
        <Routes>
          <Route path="/" element={<CustomerMenu />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/dishes"
            element={
              <RequireAdmin>
                <AdminDishes />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <RequireAdmin>
                <AdminCategories />
              </RequireAdmin>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </CartProvider>
  )
}
