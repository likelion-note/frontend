import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

export type PillTone =
  | 'orange' // 지금 14기에게 공개 · 승인 · 운영진
  | 'beige' // 15기부터 공개 · 제출일 · 파트
  | 'rose' // #태그
  | 'rose2' // 돌려보냄 · 방금 가입
  | 'outline' // 역할별 가이드
  | 'solid' // D-12 · 다음 행사
  | 'danger' // 2명 (배정 전)
  | 'white' // 중간발표 (강조 카드 안)

type Props = HTMLAttributes<HTMLSpanElement> & {
  tone?: PillTone
  size?: 'sm' | 'md'
}

const tones: Record<PillTone, string> = {
  orange: 'bg-accent-soft text-accent-deep',
  beige: 'bg-beige text-beige-ink',
  rose: 'bg-rose text-rose-ink',
  rose2: 'bg-rose-2 text-danger',
  outline: 'border-[1.2px] border-border bg-card text-ink-2',
  solid: 'bg-accent text-white',
  danger: 'bg-danger text-white',
  white: 'bg-white text-accent-deep',
}

/** 작은 라벨. 공개 범위, 태그, 상태 표시에 써요 */
export function Pill({ tone = 'orange', size = 'md', className, ...rest }: Props) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full px-[11px] py-[5px] leading-none font-bold whitespace-nowrap',
        size === 'md' ? 'text-[12px]' : 'text-[11px]',
        tones[tone],
        className,
      )}
      {...rest}
    />
  )
}
