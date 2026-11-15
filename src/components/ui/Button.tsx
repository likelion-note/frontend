import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

type Variant = 'primary' | 'ghost' | 'soft'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
}

const styles: Record<Variant, string> = {
  primary: 'h-[50px] bg-accent text-[18px] font-bold tracking-[-0.18px] text-white',
  ghost: 'h-[50px] border border-border bg-card text-[16px] font-bold tracking-[-0.16px] text-ink',
  soft: 'h-[46px] bg-accent-soft text-[16px] font-bold tracking-[-0.16px] text-accent-deep',
}

/** 둥근 알약 버튼. primary(주황) · ghost(테두리) · soft(연주황) */
export function Button({ variant = 'primary', className, type = 'button', ...rest }: Props) {
  return (
    <button
      type={type}
      className={cn(
        'flex w-full items-center justify-center rounded-full transition-[filter,opacity] active:brightness-95 disabled:cursor-default disabled:opacity-45',
        styles[variant],
        className,
      )}
      {...rest}
    />
  )
}
