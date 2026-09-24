import { useLocation } from 'react-router-dom'
import ShopRatingBadge from './ShopRating'

export default function Header({
  title = '小鱼家',
  subtitle = '家庭点餐',
}: {
  title?: string
  subtitle?: string
}) {
  const loc = useLocation()
  // 评分条只出现在主页（避免与管理/订单页面左上角的其他内容拥挤）
  const showRating = loc.pathname === '/'
  return (
    <div className="flex items-start gap-3 px-5 pb-2 pt-6">
      {/* 左上角实时店铺评分：主页显示，其他页面隐藏避免拥挤 */}
      {showRating && (
        <div className="-ml-1 -mt-1">
          <ShopRatingBadge />
        </div>
      )}
      <div className="flex items-center gap-3">
        <div className="text-4xl">🐟</div>
        <div>
          <div className="text-2xl font-bold text-terracotta">{title}</div>
          <div className="text-xs text-muted">{subtitle}</div>
        </div>
      </div>
    </div>
  )
}
