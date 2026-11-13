import sheet from '@/assets/home/notepad-sheet.png'
import gradSheet from '@/assets/home/grad-sheet.png'
import { cn } from '@/lib/cn'

/** Figma 원본 스프라이트의 위치와 비율을 그대로 유지해요. */
const crops = {
  grad: { width: '1037.84%', height: '691.89%', left: '-384.46%', top: '-370.95%' },
  wow: { width: '569.86%', height: '379.9%', left: '-189.71%', top: '-1.44%' },
  search: { width: '569.86%', height: '379.9%', left: '-373.68%', top: '-1.44%' },
  check: { width: '1156.31%', height: '770.87%', left: '-923.3%', top: '-541.26%' },
  bulb: { width: '937.8%', height: '625.2%', left: '-117.72%', top: '-423.62%' },
}

export function NoteIllustration({
  name,
  size,
  className,
}: {
  name: keyof typeof crops
  size: number
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={cn('relative block shrink-0 overflow-hidden mix-blend-multiply', className)}
      style={{ width: size, height: size }}
    >
      <img
        src={name === 'grad' ? gradSheet : sheet}
        alt=""
        draggable={false}
        className="pointer-events-none absolute max-w-none"
        style={crops[name]}
      />
    </span>
  )
}
