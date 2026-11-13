import sheet from '@/assets/home/notepad-sheet.png'
import gradSheet from '@/assets/home/grad-sheet.png'
import { cn } from '@/lib/cn'

/** Figma 원본 스프라이트의 위치와 비율을 그대로 유지해요. trophy만 졸업 사자 시트예요. */
const crops = {
  write: { width: '559.15%', height: '372.77%', left: '-6.34%', top: '-94.84%' },
  laptop: { width: '559.15%', height: '372.77%', left: '-457.75%', top: '-94.84%' },
  notepad: { width: '882.22%', height: '588.15%', left: '-132.59%', top: '-303.33%' },
  book: { width: '744.37%', height: '496.25%', left: '-393.75%', top: '-250.31%' },
  paw: { width: '827.08%', height: '551.39%', left: '-19.44%', top: '-280.21%' },
  calendar: { width: '1017.95%', height: '678.63%', left: '-498.29%', top: '-464.96%' },
  eraser: { width: '945.24%', height: '630.16%', left: '-826.98%', top: '-334.13%' },
  pencil: { width: '844.68%', height: '563.12%', left: '-654.96%', top: '-291.49%' },
  flag: { width: '1134.29%', height: '756.19%', left: '-801.43%', top: '-528.57%' },
  think: { width: '569.86%', height: '379.9%', left: '-98.56%', top: '-1.44%' },
  folder: { width: '923.26%', height: '615.5%', left: '-445.74%', top: '-509.69%' },
  docs: { width: '992.5%', height: '661.67%', left: '-280%', top: '-552.5%' },
  bell: { width: '952.8%', height: '635.2%', left: '-573.6%', top: '-431.2%' },
  clip: { width: '1123.58%', height: '749.06%', left: '-439.62%', top: '-629.25%' },
  trophy: { width: '1003.92%', height: '669.28%', left: '-767.65%', top: '-356.21%' },
}
export type JournalIllustrationName = keyof typeof crops

export function JournalIllustration({
  name,
  size,
  className,
}: {
  name: JournalIllustrationName
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
        src={name === 'trophy' ? gradSheet : sheet}
        alt=""
        draggable={false}
        className="pointer-events-none absolute max-w-none"
        style={crops[name]}
      />
    </span>
  )
}
