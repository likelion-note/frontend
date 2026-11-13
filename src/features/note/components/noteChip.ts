import { cn } from '@/lib/cn'

/** 피그마 필터 칩. 공통 Chip보다 글자가 작고, 안 고른 칩의 테두리가 연해요. */
export const noteChipClass = (selected = false) =>
  cn('shrink-0 px-3 text-[13px] leading-[16px]', !selected && 'border-[#f1e6da] bg-white')
