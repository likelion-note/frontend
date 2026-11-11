import { useId, useRef, useState } from 'react'

import { cn } from '@/lib/cn'

type Props = {
  value: string
  onChange: (next: string) => void
  length?: number
  /** 틀렸을 때 빨갛게 흔들려요 */
  error?: boolean
  disabled?: boolean
}

/** 6칸 초대코드 입력. 보이지 않는 입력칸 하나가 6칸을 움직여요 (영문·숫자, 대문자) */
export function CodeInput({ value, onChange, length = 6, error = false, disabled = false }: Props) {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [focused, setFocused] = useState(false)
  const chars = Array.from({ length }, (_, i) => value[i] ?? '')
  const activeIndex = Math.min(value.length, length - 1)

  return (
    <div className="relative w-full">
      <label htmlFor={id} className="sr-only">
        초대코드 {length}자리
      </label>
      <div
        key={error ? 'error' : 'ok'}
        className={cn('flex w-full justify-between gap-1.5', error && 'animate-shake')}
        onClick={() => inputRef.current?.focus()}
      >
        {chars.map((ch, i) => {
          const active = focused && i === activeIndex && !error
          return (
            <div
              key={i}
              aria-hidden
              className={cn(
                'bg-card text-ink flex h-[58px] flex-1 items-center justify-center rounded-xl border-[1.4px] text-[24px] font-bold transition-colors',
                error ? 'border-danger text-danger' : active ? 'border-accent' : 'border-border',
                ch === '' && !active && 'shadow-card',
              )}
            >
              {ch}
            </div>
          )
        })}
      </div>
      <input
        ref={inputRef}
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => {
          const next = e.target.value
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, '')
            .slice(0, length)
          onChange(next)
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        inputMode="text"
        autoComplete="one-time-code"
        autoCapitalize="characters"
        autoCorrect="off"
        spellCheck={false}
        maxLength={length}
        className="absolute inset-0 h-full w-full cursor-text opacity-0"
      />
    </div>
  )
}
