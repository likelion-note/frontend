import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

type Props = HTMLAttributes<HTMLDivElement> & {
  as?: 'div' | 'section' | 'article'
}

/** 흰 종이 카드. 그림자와 둥근 모서리가 들어가요 */
export function Card({ as: Tag = 'div', className, ...rest }: Props) {
  return (
    <Tag
      className={cn('bg-card shadow-card w-full rounded-2xl px-[18px] py-4', className)}
      {...rest}
    />
  )
}

/** 카드 안 줄 구분선 */
export function Divider({ className }: { className?: string }) {
  return <div className={cn('bg-line h-px w-full', className)} />
}
