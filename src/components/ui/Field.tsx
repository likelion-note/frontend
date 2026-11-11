import type { InputHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/cn'

type FieldProps = {
  label: string
  htmlFor?: string
  children: ReactNode
  className?: string
}

/** 라벨 + 입력 묶음. 시트 안의 폼에 써요 */
export function Field({ label, htmlFor, children, className }: FieldProps) {
  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-ink text-[14px] leading-none font-bold">
        {label}
      </label>
      {children}
    </div>
  )
}

type InputProps = InputHTMLAttributes<HTMLInputElement>

/** 밑줄만 있는 입력칸 (피그마 분류 제목 입력칸) */
export function UnderlineInput({ className, ...rest }: InputProps) {
  return (
    <input
      className={cn(
        'border-input-line text-ink placeholder:text-placeholder focus:border-accent h-[46px] w-full rounded-none border-b-[1.4px] bg-transparent px-0.5 text-[15px] outline-none',
        className,
      )}
      {...rest}
    />
  )
}
