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

/** 顾客餐后评价：两个维度各 1-5 星 + 文字评论（可删除、可改） */
export interface Review {
  id: string
  order_id: string
  order_no: string
  items: OrderItem[]
  dish_rating: number
  service_rating: number
  comment: string | null
  created_at: string
  updated_at: string
}

/** 店铺平均分：菜品 50% + 服务 50%（首页左上角实时显示用） */
export interface ShopRating {
  /** 总平均分（0-5，保留 1 位小数） */
  overall: number
  /** 菜品平均分 */
  dish: number
  /** 服务平均分 */
  service: number
  /** 评价条数 */
  count: number
}
