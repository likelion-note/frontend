import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { formatActionItem } from '@/features/meeting/formatRecord'
import { shareMeetingRecord } from '@/features/meeting/shareRecord'
import type { MeetingRecord } from '@/features/meeting/types'
import { useToast } from '@/hooks/useToast'
import { formatMonthDay } from '@/lib/date'

export function MeetingHistoryCard({
  record,
  initiallyOpen = false,
}: {
  record: MeetingRecord
  initiallyOpen?: boolean
}) {
  const [open, setOpen] = useState(initiallyOpen)
  const [sharing, setSharing] = useState(false)
  const toast = useToast()
  const headerId = `record-heading-${record.id}`
  const panelId = `record-details-${record.id}`

  async function share() {
    if (sharing) return
    setSharing(true)
    try {
      const result = await shareMeetingRecord(record)
      if (result === 'shared') toast('회의 내용을 공유했어요.')
      else if (result === 'copied') toast('회의 내용이 복사되었습니다.')
      else toast('공유를 취소했어요.')
    } catch (error) {
      toast(error instanceof Error ? error.message : '회의 내용을 공유하지 못했어요.')
    } finally {
      setSharing(false)
    }
  }

  return (
    <Card as="article" aria-labelledby={headerId}>
      <h2>
        <button
          id={headerId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="focus-visible:outline-accent relative flex w-full items-center gap-2 rounded text-left focus-visible:outline-2"
        >
          <span aria-hidden="true" className="absolute inset-x-0 -inset-y-[5px]" />
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] leading-[18px] font-bold">{record.title}</span>
            <time
              dateTime={record.date}
              className="text-muted mt-0.5 block text-[12px] leading-[14px]"
            >
              {formatMonthDay(record.date)}
            </time>
          </span>
          <span
            aria-hidden="true"
            className="text-muted shrink-0 text-[13px] leading-[16px] font-bold"
          >
            {open ? '▴' : '▾'}
          </span>
        </button>
      </h2>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        aria-hidden={!open}
        inert={!open}
        className="grid transition-[grid-template-rows,opacity] duration-250 ease-out motion-reduce:transition-none"
        style={{ gridTemplateRows: open ? '1fr' : '0fr', opacity: open ? 1 : 0 }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="flex flex-col gap-2.5 pt-2.5">
            <div className="flex flex-col gap-1 rounded-[22px] bg-white px-[18px] py-4">
              <h3 className="text-muted text-[12px] leading-[14px] font-bold">정한 것</h3>
              {record.decisions.map((decision, index) => (
                <p
                  key={`${record.id}-decision-${index}`}
                  className="text-[14px] leading-[17px] font-medium [overflow-wrap:anywhere] whitespace-pre-wrap"
                >
                  {decision}
                </p>
              ))}
              <h3 className="text-muted text-[12px] leading-[14px] font-bold">누가 언제까지</h3>
              {record.actionItems.map((item) => (
                <p
                  key={item.id}
                  className="text-[14px] leading-[17px] font-medium [overflow-wrap:anywhere] whitespace-pre-wrap"
                >
                  {formatActionItem(item)}
                </p>
              ))}
            </div>
            <Button
              variant="soft"
              onClick={() => void share()}
              disabled={sharing}
              aria-busy={sharing}
              className="leading-[19px]"
            >
              공유하기
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
