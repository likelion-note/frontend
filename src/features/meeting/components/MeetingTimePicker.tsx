import { useState } from 'react'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { Button } from '@/components/ui/Button'
const hours = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, '0'))
const minutes = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'))
export function MeetingTimePicker({
  time,
  onChange,
}: {
  time: string
  onChange: (time: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [hour, minute] = time.split(':')
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
        <div className="flex items-center justify-center gap-3">
          <label className="text-muted flex flex-1 flex-col gap-2 text-[13px]">
            시
            <select
              aria-label="시"
              value={hour}
              onChange={(event) => onChange(`${event.target.value}:${minute}`)}
              className="border-border text-ink rounded-xl border bg-white p-3 text-[20px] font-bold"
            >
              {hours.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <span aria-hidden="true" className="mt-6 text-[22px]">
            :
          </span>
          <label className="text-muted flex flex-1 flex-col gap-2 text-[13px]">
            분
            <select
              aria-label="분"
              value={minute}
              onChange={(event) => onChange(`${hour}:${event.target.value}`)}
              className="border-border text-ink rounded-xl border bg-white p-3 text-[20px] font-bold"
            >
              {minutes.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </div>
        <Button onClick={() => setOpen(false)}>완료</Button>
      </BottomSheet>
    </div>
  )
}
