import { useEffect, useId, useRef, useState, type ReactNode } from 'react'

import { cn } from '@/lib/cn'
import { getFrameElement } from '@/lib/frame'

export type DropdownOption<T extends string> = { value: T; label: string }

type Props<T extends string> = {
  id?: string
  /** 화면에 라벨이 따로 없을 때 읽어 줄 이름 */
  ariaLabel?: string
  value: T | null
  options: DropdownOption<T>[]
  onChange: (value: T) => void
  /** 아직 안 골랐을 때 보여줄 글 */
  placeholder?: string
  /** 감싸는 칸. 너비 · 위치를 정해요 */
  className?: string
  /** 누르는 칸의 모양. 기본은 밑줄 입력칸 모양이에요 */
  triggerClassName?: string
  /** 목록을 어느 쪽에 맞출지. 좁은 칸은 'right' 로 오른쪽에 맞춰요 */
  align?: 'left' | 'right'
  /** 목록 너비를 칸보다 넓게 잡고 싶을 때 (예: 'w-[132px]') */
  menuClassName?: string
  /** 칸 안의 글 앞에 붙일 것 (아이콘 등) */
  leading?: ReactNode
  invalid?: boolean
  describedBy?: string
}

/** 목록이 이보다 길면 안에서 스크롤해요 */
const MENU_MAX_HEIGHT = 320

/**
 * 고르는 칸. 브라우저 기본 선택 상자 대신 앱 모양의 목록을 칸 아래(자리가 없으면 위)에 펼쳐요.
 * 바깥을 누르거나 Esc 를 누르면 닫히고, 위아래 화살표와 Enter 로도 고를 수 있어요.
 */
export function Dropdown<T extends string>({
  id,
  ariaLabel,
  value,
  options,
  onChange,
  placeholder = '골라 주세요',
  className,
  triggerClassName,
  align = 'left',
  menuClassName,
  leading,
  invalid,
  describedBy,
}: Props<T>) {
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [upward, setUpward] = useState(false)
  const [active, setActive] = useState(-1)
  const selected = options.find((option) => option.value === value)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const openMenu = () => {
    // 아래에 자리가 모자라고 위가 더 넓으면 위로 펼쳐요 (폰 프레임 기준)
    const trigger = rootRef.current?.getBoundingClientRect()
    const frame = (getFrameElement() ?? document.body).getBoundingClientRect()
    if (trigger) {
      const below = frame.bottom - trigger.bottom
      const above = trigger.top - frame.top
      const needed = Math.min(MENU_MAX_HEIGHT, options.length * 42 + 16)
      setUpward(below < needed && above > below)
    }
    setActive(options.findIndex((option) => option.value === value))
    setOpen(true)
  }

  const choose = (option: DropdownOption<T>) => {
    onChange(option.value)
    setOpen(false)
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!open) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        openMenu()
      }
      return
    }
    if (event.key === 'Escape') {
      // 시트 안에서 쓸 때 시트까지 닫히지 않게 여기서 멈춰요
      event.preventDefault()
      event.stopPropagation()
      setOpen(false)
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const step = event.key === 'ArrowDown' ? 1 : -1
      setActive((current) => (current + step + options.length) % options.length)
    } else if (event.key === 'Enter' || event.key === ' ') {
      if (active >= 0) {
        event.preventDefault()
        choose(options[active])
      }
    }
  }

  return (
    <div ref={rootRef} className={cn('relative', className)} onKeyDown={onKeyDown}>
      <button
        id={id}
        type="button"
        role="combobox"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        onClick={() => (open ? setOpen(false) : openMenu())}
        className={cn(
          'flex w-full items-center gap-1.5 text-left outline-none',
          triggerClassName ??
            cn(
              'h-[50px] border-b-[1.4px] px-0.5 text-[14px] leading-[20px]',
              open ? 'border-accent' : 'border-input-line',
            ),
          !selected && 'text-placeholder',
        )}
      >
        {leading}
        <span className="min-w-0 flex-1 truncate">{selected?.label ?? placeholder}</span>
        <span
          aria-hidden="true"
          className={cn(
            'text-muted shrink-0 text-[13px] leading-none font-bold transition-transform',
            open && 'rotate-180',
          )}
        >
          ▾
        </span>
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          className={cn(
            'border-border bg-card no-scrollbar absolute z-30 flex min-w-full flex-col overflow-y-auto rounded-2xl border py-1.5 shadow-[0_10px_28px_rgba(115,77,38,0.18)]',
            align === 'right' ? 'right-0' : 'left-0',
            upward ? 'bottom-full mb-1.5' : 'top-full mt-1.5',
            menuClassName,
          )}
          style={{ maxHeight: MENU_MAX_HEIGHT }}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value
            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={-1}
                  onClick={() => choose(option)}
                  onPointerEnter={() => setActive(index)}
                  className={cn(
                    'flex w-full items-center gap-2 px-3.5 py-[11px] text-left text-[14px] leading-[20px] whitespace-nowrap',
                    isSelected ? 'text-accent-deep font-bold' : 'text-ink',
                    index === active && 'bg-accent-soft',
                  )}
                >
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  {isSelected && (
                    <span aria-hidden="true" className="text-accent shrink-0 text-[13px]">
                      ✓
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
