const KEY = 'xiaoyu_my_orders'

/** 把刚下的订单号记到本机，供「我的订单」页查询状态 */
export function saveMyOrder(orderNo: string) {
  const arr = getMyOrders()
  if (!arr.includes(orderNo)) {
    arr.unshift(orderNo)
    try {
      localStorage.setItem(KEY, JSON.stringify(arr.slice(0, 50)))
    } catch {
      /* 忽略隐私模式下的写入失败 */
    }
  }
}

export function getMyOrders(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}