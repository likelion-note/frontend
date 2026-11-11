import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

import { BottomSheet } from '@/components/ui/BottomSheet'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { Field, UnderlineInput } from '@/components/ui/Field'
import * as api from '@/features/admin/api'
import { useInvalidateAdmin } from '@/features/admin/hooks/useInvalidateAdmin'
import { EVENT_TYPE_LABEL, type EventType } from '@/features/admin/types'
import { useToast } from '@/hooks/useToast'

type Props = {
  open: boolean
  onClose: () => void
}

const EVENT_TYPES = Object.keys(EVENT_TYPE_LABEL) as EventType[]

/** 일정 추가 시트. 행사 이름 · 유형 · 날짜 */
export function AddEventSheet({ open, onClose }: Props) {
  const toast = useToast()
  const invalidate = useInvalidateAdmin()
  const [name, setName] = useState('')
  const [type, setType] = useState<EventType>('SESSION')
  const [date, setDate] = useState('')

  const close = () => {
    setName('')
    setType('SESSION')
    setDate('')
    onClose()
  }

  const create = useMutation({
    mutationFn: () => api.createEvent({ name, type, date }),
    onSuccess: async (event) => {
      await invalidate()
      toast(`"${event.name}" 일정을 추가했어요`)
      close()
    },
    onError: (e: Error) => toast(e.message),
  })

  const canCreate = name.trim().length > 0 && date.length > 0 && !create.isPending

  return (
    <BottomSheet
      open={open}
      onClose={close}
      title="일정 추가"
      illust="lion-calendar"
      description="저장하면 모든 아기사자 홈의 주차와 D-day 가 바로 바뀌어요."
    >
      <Field label="행사 이름" htmlFor="event-name">
        <UnderlineInput
          id="event-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 정기 세션: 기획서 쓰기"
        />
      </Field>

      <p className="text-ink pt-1 text-[14px] leading-none font-bold">행사 유형</p>
      <div className="flex w-full flex-wrap gap-1.5">
        {EVENT_TYPES.map((t) => (
          <Chip key={t} selected={type === t} onClick={() => setType(t)}>
            {EVENT_TYPE_LABEL[t]}
          </Chip>
        ))}
      </div>

      <Field label="날짜" htmlFor="event-date" className="pt-1">
        <UnderlineInput
          id="event-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </Field>

      <div className="h-1.5" />

      <div className="flex w-full items-center gap-2">
        <Button variant="ghost" className="flex-1" onClick={close}>
          취소
        </Button>
        <Button className="flex-1" disabled={!canCreate} onClick={() => create.mutate()}>
          추가하기
        </Button>
      </div>
    </BottomSheet>
  )
}
