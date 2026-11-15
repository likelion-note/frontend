import type { TextareaHTMLAttributes } from 'react'

import lines from '@/assets/meeting/summary-lines.svg'
import { AutoGrowTextarea } from '@/features/meeting/components/AutoGrowTextarea'
import { cn } from '@/lib/cn'

/**
 * 공책 줄이 그어진 입력칸. 회의 정리의 입력칸과 같은 에셋 · 줄 간격(26px)이고 글이 길면 늘어나요.
 * 80px 칸도 같은 110px 줄 에셋의 위 두 줄만 보여서 Figma와 같아요.
 */
export function RuledTextarea({
  value,
  minHeight,
  className,
  ...props
}: Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value'> & {
  value: string
  minHeight: 80 | 110
}) {
  return (
    <AutoGrowTextarea
      value={value}
      minHeight={minHeight}
      className={cn(
        'bg-card shadow-card text-ink placeholder:text-icon-muted focus-visible:outline-accent aria-invalid:outline-danger rounded-[10px] [background-size:350px_110px] [background-repeat:repeat-y] px-4 pt-3.5 pb-3 text-[14px] leading-[26px] outline-none focus-visible:outline-2 aria-invalid:outline-2',
        className,
      )}
      style={{ backgroundImage: `url("${lines}")` }}
      {...props}
    />
  )
}
