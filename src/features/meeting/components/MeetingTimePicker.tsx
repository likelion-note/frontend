import { useState } from 'react'

import { ChevronIcon } from '@/components/icons'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { Button } from '@/components/ui/Button'

const pad = (value: number) => String(value).padStart(2, '0')
/** 분은 5분 단위로 올리고 내려요 */
const MINUTE_STEP = 5

/**
 * 회의 시간 바꾸기. 시와 분을 위아래 화살표로 올리고 내려요 (브라우저 기본 선택 상자를 쓰지 않아요).
 * 시는 0~23, 분은 5분 단위로 돌아요.
 */
export function MeetingTimePicker({
  time,
  onChange,
}: {
  time: string
  onChange: (time: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [hour, minute] = time.split(':').map(Number)

  const setHour = (delta: number) => onChange(`${pad((hour + delta + 24) % 24)}:${pad(minute)}`)
  const setMinute = (delta: number) => {
    // 5분 단위가 아닌 값(예: 19:03)에서 누르면 가까운 5분 단위로 맞춰요
    const snapped =
      delta > 0
        ? Math.floor(minute / MINUTE_STEP) * MINUTE_STEP + MINUTE_STEP
        : Math.ceil(minute / MINUTE_STEP) * MINUTE_STEP - MINUTE_STEP
    onChange(`${pad(hour)}:${pad((snapped + 60) % 60)}`)
  }

  return (
    <div data-no-swipe>
      <button
        type="button"
        aria-label={`회의 시간 ${time} 변경`}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="border-border rounded-full border bg-white px-3 py-1.5 text-[13px] leading-[16px] font-bold tabular-nums"
      >
        {time}
      </button>
      <BottomSheet open={open} onClose={() => setOpen(false)} title="회의 시간" motion>
        <div className="flex items-center justify-center gap-4 py-1">
          <Stepper label="시" value={pad(hour)} onStep={setHour} />
          <span aria-hidden="true" className="text-ink pt-5 text-[26px] font-bold">
            :
          </span>
          <Stepper label="분" value={pad(minute)} onStep={setMinute} />
        </div>
        <Button onClick={() => setOpen(false)}>완료</Button>
      </BottomSheet>
    </div>
  )
}

function Stepper({
  label,
  value,
  onStep,
}: {
  label: string
  value: string
  onStep: (delta: number) => void
}) {
  const arrow =
    'text-accent-deep bg-accent-soft flex h-9 w-[92px] items-center justify-center rounded-full active:brightness-95'
  return (
    <div role="group" aria-label={label} className="flex flex-col items-center gap-1.5">
      <span className="text-muted text-[13px] leading-none">{label}</span>
      <button
        type="button"
        aria-label={`${label} 올리기`}
        onClick={() => onStep(1)}
        className={arrow}
      >
        <ChevronIcon size={18} className="-rotate-90" />
      </button>
      <output
        aria-live="polite"
        className="border-border text-ink flex h-[56px] w-[92px] items-center justify-center rounded-2xl border bg-white text-[26px] leading-none font-bold tabular-nums"
      >
        {value}
      </output>
      <button
        type="button"
        aria-label={`${label} 내리기`}
        onClick={() => onStep(-1)}
        className={arrow}
      >
        <ChevronIcon size={18} className="rotate-90" />
      </button>
    </div>
  )
}
