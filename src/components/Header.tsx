export default function Header({
  title = '小鱼家',
  subtitle = '家庭点餐',
}: {
  title?: string
  subtitle?: string
}) {
  return (
    <div className="flex items-center gap-3 px-5 pb-2 pt-6">
      <div className="text-4xl">🐟</div>
      <div>
        <div className="text-2xl font-bold text-terracotta">{title}</div>
        <div className="text-xs text-muted">{subtitle}</div>
      </div>
    </div>
  )
}
