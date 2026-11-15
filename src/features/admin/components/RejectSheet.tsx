import { useState } from 'react'

import { BottomSheet } from '@/components/ui/BottomSheet'
import { Button } from '@/components/ui/Button'
import { REJECT_PRESETS } from '@/features/admin/labels'
import { cn } from '@/lib/cn'

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (reason: string) => void
  submitting?: boolean
}

/** SCR-ADM-03 돌려보내기 시트. 자주 쓰는 사유를 누르면 입력칸에 채워져요 */
export function RejectSheet({ open, onClose, onSubmit, submitting = false }: Props) {
  const [reason, setReason] = useState('')
  const trimmed = reason.trim()

  const close = () => {
    setReason('')
    onClose()
  }

  return (
    <BottomSheet
      open={open}
      onClose={close}
      title="돌려보내기"
      illust="lion-think"
      description="작성자에게 한 줄 사유가 보여요. 고쳐서 다시 낼 수 있어요."
    >
      <div className="flex w-full items-center gap-1.5 pt-1">
        <span className="text-ink text-[14px] leading-none font-bold">자주 쓰는 사유</span>
        <span className="text-muted text-[12px] leading-none">누르면 아래에 채워져요</span>
      </div>

      {REJECT_PRESETS.map((preset) => {
        const selected = trimmed === preset
        return (
          <button
            key={preset}
            type="button"
            onClick={() => setReason(preset)}
            className={cn(
              'w-full rounded-2xl px-[18px] py-3 text-left text-[14px] leading-normal transition-colors',
              selected
                ? 'bg-accent-soft text-ink border-accent/80 border-[1.4px] font-medium'
                : 'bg-card text-ink shadow-card border-[1.4px] border-transparent',
            )}
          >
            {preset}
          </button>
        )
      })}

      <div className="flex w-full flex-col gap-1.5">
        <label htmlFor="reject-reason" className="text-ink text-[14px] leading-none font-bold">
          보낼 사유
        </label>
        <textarea
          id="reject-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder="한 줄로 적어 주세요"
          className="bg-card shadow-card ruled-lines text-ink placeholder:text-muted/70 h-[84px] w-full resize-none rounded-[10px] px-3 pt-3 pb-1 text-[15px] leading-[26px] outline-none"
        />
      </div>

      <div className="flex w-full items-center gap-2">
        <Button variant="ghost" className="flex-1" onClick={close}>
          취소
        </Button>
        <Button
          className="flex-1"
          disabled={!trimmed || submitting}
          onClick={() => onSubmit(trimmed)}
        >
          돌려보내기
        </Button>
      </div>
    </BottomSheet>
  )
}
