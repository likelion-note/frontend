import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean
}

/** 고르는 칩. 파트·프로젝트 선택에 써요 */
export function Chip({ selected = false, className, type = 'button', ...rest }: Props) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cn(
        'inline-flex items-center rounded-full px-[11px] py-[5px] text-[14px] leading-none font-bold whitespace-nowrap transition-colors',
        selected ? 'bg-accent text-white' : 'border-border bg-card text-ink border-[1.2px]',
        className,
      )}
      {...rest}
    />
  )
}
