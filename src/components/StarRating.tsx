import { useState } from 'react'

// 半星精度评分组件（0.5 步进）
// 点击每颗星的左半 → 加 0.5；点击右半 → 加 1.0
// 视觉：每颗星用「底色空星 + 顶层按 fill% 裁剪的填星」实现任意小数显示
// readOnly=true 时整行不可点击，仅展示

const STARS = 5
const ICON = '★'  // 实心字形，灰色当底

function clampStarFill(v: number) {
  if (Number.isNaN(v)) return 0
  return Math.max(0, Math.min(1, v))
}

function StarIcon({
  fill,
  size,
}: {
  fill: number  // 0..1
  size: number
}) {
  const f = clampStarFill(fill)
  return (
    <span
      className="relative inline-block align-middle"
      style={{ fontSize: size, width: size, height: size, lineHeight: 1 }}
      aria-hidden
    >
      {/* 底色空星（柔和灰） */}
      <span
        className="absolute inset-0 select-none"
        style={{ lineHeight: 1, color: 'rgba(170,140,110,0.30)' }}
      >
        {ICON}
      </span>
      {/* 顶层填星，按 fill% 裁剪 */}
      {f > 0 && (
        <span
          className="absolute inset-y-0 left-0 overflow-hidden select-none"
          style={{ width: `${f * 100}%`, lineHeight: 1, color: '#F4A22A' }}
        >
          {ICON}
        </span>
      )}
    </span>
  )
}

function StarButton({
  starIndex,
  baseFill,
  hoverFill,
  size,
  disabled,
  onPick,
}: {
  starIndex: number
  baseFill: number
  hoverFill: number | null
  size: number
  disabled: boolean
  onPick: (fraction: 0.5 | 1) => void
}) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const frac = x / rect.width >= 0.5 ? 1 : 0.5
    onPick(frac)
  }
  const displayFill = hoverFill !== null ? hoverFill : baseFill
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      style={{
        fontSize: size,
        lineHeight: 1,
        padding: 0,
        width: size + 4,
        height: size + 4,
      }}
      className={
        disabled
          ? 'cursor-default select-none'
          : 'cursor-pointer transition active:scale-90'
      }
      aria-label={`${starIndex} 星`}
    >
      <StarIcon fill={displayFill} size={size} />
    </button>
  )
}

export default function StarRating({
  value,
  onChange,
  readOnly = false,
  size = 22,
  className = '',
  showNumber = false,
}: {
  value: number
  onChange?: (v: number) => void
  readOnly?: boolean
  size?: number
  className?: string
  /** 是否在右侧显示当前分值（如 4.5） */
  showNumber?: boolean
}) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)
  const display = hoverValue ?? value
  return (
    <div
      className={`inline-flex items-center gap-0.5 ${className}`}
      onMouseLeave={() => setHoverValue(null)}
    >
      {Array.from({ length: STARS }, (_, i) => {
        const n = i + 1
        const baseFill = clampStarFill(display - i)
        const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
          if (readOnly) return
          const rect = e.currentTarget.getBoundingClientRect()
          const x = e.clientX - rect.left
          const frac = x / rect.width >= 0.5 ? 1 : 0.5
          setHoverValue(i + frac)
        }
        return (
          <div
            key={n}
            className="flex"
            onMouseMove={handleMove}
          >
            <StarButton
              starIndex={n}
              baseFill={baseFill}
              hoverFill={hoverValue !== null ? clampStarFill(hoverValue - i) : null}
              size={size}
              disabled={readOnly}
              onPick={(frac) => onChange?.(i + frac)}
            />
          </div>
        )
      })}
      {showNumber && (
        <span className="ml-1 text-sm font-medium text-ink">
          {display.toFixed(1)}
        </span>
      )}
    </div>
  )
}