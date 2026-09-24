// 通用五角星评分组件：受控值、可点击；readOnly 模式仅展示
// 入参：value（0-5）、onChange（受控时填）、readOnly（只读）、size（px）
export default function StarRating({
  value,
  onChange,
  readOnly = false,
  size = 22,
  className = '',
}: {
  value: number
  onChange?: (v: number) => void
  readOnly?: boolean
  size?: number
  className?: string
}) {
  // 渲染时即时显示淡黄高亮，按需切换填充态
  const stars = [1, 2, 3, 4, 5]
  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      {stars.map((n) => {
        const filled = n <= Math.round(value)
        return (
          <button
            type="button"
            key={n}
            disabled={readOnly}
            onClick={() => onChange?.(n)}
            style={{ fontSize: size, lineHeight: 1 }}
            className={
              readOnly
                ? 'cursor-default select-none'
                : 'cursor-pointer transition active:scale-90'
            }
            aria-label={`${n} 星`}
          >
            {filled ? '⭐' : '☆'}
          </button>
        )
      })}
    </div>
  )
}
