import type { ReactNode } from 'react'

import { Illust, type IllustName } from '@/components/ui/Illust'
import { cn } from '@/lib/cn'

type Props = {
  title: string
  illust?: IllustName
  /** 오른쪽 끝 글자나 버튼 */
  action?: ReactNode
  className?: string
}

/** 섹션 제목. 작은 일러스트 + 형광펜 밑줄 + 오른쪽 액션 */
export function SectionTitle({ title, illust, action, className }: Props) {
  return (
    <div className={cn('flex w-full items-center gap-1.5 pt-2', className)}>
      {illust && <Illust name={illust} size={24} />}
      <h2 className="marker-underline text-ink text-[17px] leading-tight font-bold">{title}</h2>
      <div className="flex-1" />
      {action}
    </div>
  )
}
