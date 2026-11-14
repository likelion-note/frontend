import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { CloseIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { Illust } from '@/components/ui/Illust'
import { Pill } from '@/components/ui/Pill'
import * as api from '@/features/admin/api'
import { AddEventSheet } from '@/features/admin/components/AddEventSheet'
import { useInvalidateAdmin } from '@/features/admin/hooks/useInvalidateAdmin'
import { MOCK_TODAY } from '@/features/admin/mock/data'
import { eventsQuery } from '@/features/admin/queries'
import { EVENT_TYPE_LABEL, MAJOR_EVENT_TYPES, type ScheduleEvent } from '@/features/admin/types'
import { cn } from '@/lib/cn'
import { daysBetween, formatDday, formatMonthDay, formatWeekday } from '@/lib/date'
import { useToast } from '@/hooks/useToast'

/** SCR-ADM-07 운영 › 일정 칸 */
export function ScheduleSection() {
  const toast = useToast()
  const invalidate = useInvalidateAdmin()
  const { data: events = [] } = useQuery(eventsQuery())
  const [adding, setAdding] = useState(false)

  const remove = useMutation({
    mutationFn: (id: string) => api.deleteEvent(id),
    onSuccess: async () => {
      await invalidate()
      toast('일정을 지웠어요')
    },
    onError: (e: Error) => toast(e.message),
  })

  const today = MOCK_TODAY
  const nextMajor = events.find((e) => MAJOR_EVENT_TYPES.includes(e.type) && e.date >= today)

  return (
    <>
      <div className="bg-note flex w-full items-center gap-3 rounded-2xl px-4 py-3.5">
        <Illust name="bell" size={28} />
        <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
          <p className="text-ink text-[14px] leading-tight font-bold">
            바꾸면 모든 아기사자 홈이 바로 바뀌어요
          </p>
          <p className="text-ink-2 text-[12px] leading-tight">
            주차, D-day, 할 일, 추천 노트가 일정에 맞춰 달라져요
          </p>
        </div>
      </div>

      {events.length === 0 && (
        <p className="text-muted py-6 text-center text-[13px]">아직 등록한 일정이 없어요.</p>
      )}
      {events.map((event) => (
        <EventRow
          key={event.id}
          event={event}
          isPast={event.date < today}
          isNext={event.id === nextMajor?.id}
          dday={daysBetween(today, event.date)}
          onDelete={() => remove.mutate(event.id)}
          deleting={remove.isPending}
        />
      ))}

      <Button onClick={() => setAdding(true)}>+ 일정 추가</Button>

      <AddEventSheet open={adding} onClose={() => setAdding(false)} />
    </>
  )
}

function EventRow({
  event,
  isPast,
  isNext,
  dday,
  onDelete,
  deleting,
}: {
  event: ScheduleEvent
  isPast: boolean
  isNext: boolean
  dday: number
  onDelete: () => void
  deleting: boolean
}) {
  return (
    <div className={cn('flex w-full items-center gap-3', isPast && 'opacity-45')}>
      <div className="flex w-[52px] shrink-0 flex-col">
        <span
          className={cn(
            'text-[16px] leading-tight font-bold whitespace-nowrap',
            isNext ? 'text-accent-deep' : 'text-ink',
          )}
        >
          {formatMonthDay(event.date)}
        </span>
        <span className="text-muted text-[11px] leading-tight font-medium">
          {formatWeekday(event.date)}
        </span>
      </div>
      <div
        className={cn(
          'flex min-w-0 flex-1 items-center gap-2 rounded-2xl px-[18px] py-3',
          isNext
            ? 'bg-accent-soft border-accent/60 border-[1.4px]'
            : 'bg-card shadow-card border-[1.4px] border-transparent',
        )}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <p className="text-ink text-[15px] leading-tight font-bold">{event.name}</p>
          <div className="flex flex-wrap items-center gap-1">
            <Pill tone={isNext ? 'white' : 'beige'} size="sm">
              {EVENT_TYPE_LABEL[event.type]}
            </Pill>
            {isNext && (
              <Pill tone="solid" size="sm">
                {formatDday(dday)} · 다음 행사
              </Pill>
            )}
          </div>
        </div>
        <button
          type="button"
          aria-label={`${event.name} 일정 삭제`}
          onClick={onDelete}
          disabled={deleting}
          className="relative shrink-0 p-0.5 before:absolute before:-inset-2.5"
        >
          <CloseIcon size={18} />
        </button>
      </div>
    </div>
  )
}
