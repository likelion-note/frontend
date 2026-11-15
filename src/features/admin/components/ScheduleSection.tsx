import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { CloseIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { Illust } from '@/components/ui/Illust'
import { Pill } from '@/components/ui/Pill'
import * as api from '@/features/admin/api'
import { AddEventSheet } from '@/features/admin/components/AddEventSheet'
import { useInvalidateAdmin } from '@/features/admin/hooks/useInvalidateAdmin'
import { getProjectTimeline, periodStatus } from '@/features/admin/timeline'
import { eventsQuery } from '@/features/admin/queries'
import { EVENT_TYPE_LABEL, MAJOR_EVENT_TYPES, type ScheduleEvent } from '@/features/admin/types'
import { cn } from '@/lib/cn'
import { daysBetween, formatDday, formatMonthDay, formatWeekday } from '@/lib/date'
import { useToast } from '@/hooks/useToast'

/** SCR-ADM-07 운영 › 일정 칸 */
export function ScheduleSection() {
  const toast = useToast()
  const invalidate = useInvalidateAdmin()
  const { data: events = [], isSuccess } = useQuery(eventsQuery())
  const [adding, setAdding] = useState(false)

  const remove = useMutation({
    mutationFn: (id: string) => api.deleteEvent(id),
    onSuccess: async () => {
      await invalidate()
      toast('일정을 지웠어요')
    },
    onError: (e: Error) => toast(e.message),
  })

  // 목 모드는 목 달력의 오늘, 실제 모드는 진짜 오늘
  const today = getProjectTimeline().today
  const nextMajor = events.find((e) => MAJOR_EVENT_TYPES.includes(e.type) && e.date >= today)

  // 지금 일정으로 아기사자 홈이 '프로젝트 기간'으로 보이는지. 아니면 무엇을 등록해야 하는지 알려줘요.
  const period = isSuccess ? periodStatus(events, today) : null
  const warning =
    period?.state === 'no-start'
      ? {
          title: "'프로젝트 시작' 일정이 없어요",
          body: "유형을 '프로젝트 시작'으로 등록해야 아기사자 홈에 주차와 할 일이 나와요. 지금은 '프로젝트 기간이 아니에요'로 보여요.",
        }
      : period?.state === 'not-started'
        ? {
            title: `프로젝트 시작 전이에요 (${formatMonthDay(period.startDate)} 시작)`,
            body: "시작일 전까지 아기사자 홈은 '프로젝트 기간이 아니에요'로 보여요.",
          }
        : period?.state === 'no-major'
          ? {
              title: '남은 큰 행사가 없어요',
              body: '오늘 이후의 해커톤 · 중간발표 · 데모데이 같은 행사를 하나 이상 등록해야 프로젝트 기간으로 보여요. 정기 세션은 세지 않아요.',
            }
          : null

  return (
    <>
      {warning ? (
        <div
          role="status"
          className="bg-rose-2 flex w-full items-start gap-3 rounded-2xl px-4 py-3.5"
        >
          <Illust name="bell" size={28} />
          <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
            <p className="text-danger text-[14px] leading-tight font-bold">{warning.title}</p>
            <p className="text-ink-2 text-[12px] leading-normal">{warning.body}</p>
          </div>
        </div>
      ) : (
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
      )}

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
        {api.adminCapabilities.deleteEvent && (
          <button
            type="button"
            aria-label={`${event.name} 일정 삭제`}
            onClick={onDelete}
            disabled={deleting}
            className="relative shrink-0 p-0.5 before:absolute before:-inset-2.5"
          >
            <CloseIcon size={18} />
          </button>
        )}
      </div>
    </div>
  )
}
