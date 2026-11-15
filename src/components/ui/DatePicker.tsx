import { useState } from 'react'

import { ChevronIcon } from '@/components/icons'
import { Illust } from '@/components/ui/Illust'
import { cn } from '@/lib/cn'
import { formatWeekday, parseDate } from '@/lib/date'

type Props = {
  id: string
  /** 'YYYY-MM-DD'. 아직 안 골랐으면 빈 문자열 */
  value: string
  onChange: (date: string) => void
  /** 오늘 날짜 ('YYYY-MM-DD'). 달력에 '오늘' 표시를 해요 */
  today: string
  /** 이 날짜보다 앞은 고를 수 없어요 */
  min?: string
  placeholder?: string
}

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']
const pad = (value: number) => String(value).padStart(2, '0')
const toDateString = (year: number, month: number, day: number) =>
  `${year}-${pad(month + 1)}-${pad(day)}`

/** '2026년 11월 21일 토요일' */
function formatLong(date: string) {
  const d = parseDate(date)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${formatWeekday(date)}`
}

/**
 * 날짜 고르기. 브라우저 기본 달력 대신 앱 색으로 그린 달력을 칸 아래에 펼쳐요.
 * 칸을 누르면 달력이 열리고, 날짜를 고르면 닫혀요.
 */
export function DatePicker({
  id,
  value,
  onChange,
  today,
  min,
  placeholder = '날짜를 골라 주세요',
}: Props) {
  const [open, setOpen] = useState(false)
  // 보여줄 달: 고른 날짜가 있으면 그 달, 없으면 오늘이 있는 달
  const anchor = parseDate(value || today)
  const [view, setView] = useState({ year: anchor.getFullYear(), month: anchor.getMonth() })

  const firstWeekday = new Date(view.year, view.month, 1).getDay()
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ]

  const move = (delta: number) =>
    setView(({ year, month }) => {
      const next = new Date(year, month + delta, 1)
      return { year: next.getFullYear(), month: next.getMonth() }
    })

  const toggle = () => {
    // 열 때마다 고른 날짜(없으면 오늘)가 있는 달부터 보여줘요
    if (!open) {
      const base = parseDate(value || today)
      setView({ year: base.getFullYear(), month: base.getMonth() })
    }
    setOpen((current) => !current)
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <button
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={toggle}
        className={cn(
          'flex h-[46px] w-full items-center gap-2 border-b-[1.4px] px-0.5 text-left text-[15px] outline-none',
          open ? 'border-accent' : 'border-input-line',
          value ? 'text-ink' : 'text-placeholder',
        )}
      >
        <span className="min-w-0 flex-1 truncate">{value ? formatLong(value) : placeholder}</span>
        <Illust name="calendar" size={22} />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="날짜 고르기"
          className="border-border bg-card shadow-card flex w-full flex-col gap-1.5 rounded-2xl border px-3 pt-2.5 pb-3"
        >
          <div className="flex items-center justify-between px-1">
            <button
              type="button"
              aria-label="이전 달"
              onClick={() => move(-1)}
              className="text-ink flex size-8 items-center justify-center rounded-full active:bg-black/5"
            >
              <ChevronIcon size={18} className="rotate-180" />
            </button>
            <p aria-live="polite" className="text-ink text-[15px] leading-none font-bold">
              {view.year}년 {view.month + 1}월
            </p>
            <button
              type="button"
              aria-label="다음 달"
              onClick={() => move(1)}
              className="text-ink flex size-8 items-center justify-center rounded-full active:bg-black/5"
            >
              <ChevronIcon size={18} className="" />
            </button>
          </div>

          <div className="grid grid-cols-7 text-center">
            {WEEKDAY_LABELS.map((label, index) => (
              <span
                key={label}
                className={cn(
                  'py-1 text-[11px] leading-none font-bold',
                  index === 0 ? 'text-danger' : 'text-muted',
                )}
              >
                {label}
              </span>
            ))}
            {cells.map((day, index) => {
              if (day === null) return <span key={`blank-${index}`} />
              const date = toDateString(view.year, view.month, day)
              const selected = date === value
              const isToday = date === today
              const disabled = !!min && date < min
              return (
                <button
                  key={date}
                  type="button"
                  disabled={disabled}
                  aria-label={formatLong(date)}
                  aria-pressed={selected}
                  aria-current={isToday ? 'date' : undefined}
                  onClick={() => {
                    onChange(date)
                    setOpen(false)
                  }}
                  className="flex h-[38px] items-center justify-center disabled:cursor-default"
                >
                  <span
                    className={cn(
                      'flex size-[34px] items-center justify-center rounded-full text-[14px] leading-none',
                      selected
                        ? 'bg-accent font-bold text-white'
                        : isToday
                          ? 'bg-accent-soft text-accent-deep font-bold'
                          : index % 7 === 0
                            ? 'text-danger'
                            : 'text-ink',
                      disabled && 'opacity-30',
                    )}
                  >
                    {day}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
