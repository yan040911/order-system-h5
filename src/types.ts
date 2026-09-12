export interface Category {
  id: string
  name: string
  icon: string
  sort: number
  created_at?: string
}

export interface Dish {
  id: string
  category_id: string
  name: string
  description: string
  tags: string[]
  // 注：image_url 列现用作「emoji 图标」存储（家庭版无需真实图片地址）
  image_url: string
  status: 'on' | 'off'
  sort: number
  created_at?: string
}

export type OrderStatus = 'pending' | 'preparing' | 'done' | 'cancelled'

export interface OrderItem {
  dish_id: string
  name: string
  qty: number
  note?: string
}

export interface Order {
  id: string
  order_no: string
  items: OrderItem[]
  status: OrderStatus
  table_no: string
  note: string
  created_at: string
  updated_at: string
}

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: '待制作',
  preparing: '制作中',
  done: '已完成',
  cancelled: '已取消',
}
