import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { CloseIcon } from '@/components/icons'
import { Illust, type IllustName } from '@/components/ui/Illust'
import { cn } from '@/lib/cn'
import { getFrameElement } from '@/lib/frame'

type Props = {
  open: boolean
  onClose: () => void
  title: string
  illust?: IllustName
  illustSize?: number
  /** 제목 아래 한 줄 설명 */
  description?: ReactNode
  children: ReactNode
  className?: string
}

/** 아래에서 올라오는 시트. 390px 프레임 안에서만 딤이 깔려요 */
export function BottomSheet({
  open,
  onClose,
  title,
  illust,
  illustSize = 36,
  description,
  children,
  className,
}: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="absolute inset-0 z-50">
      <div className="relative h-full w-full">
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="animate-fade-in bg-dim absolute inset-0 cursor-default"
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className={cn(
            'animate-sheet-up bg-paper no-scrollbar absolute inset-x-0 bottom-0 flex max-h-[92%] flex-col gap-3.5 overflow-y-auto rounded-t-3xl px-5 pt-3 pb-[34px]',
            className,
          )}
        >
          <div className="flex w-full justify-center">
            <div className="bg-handle h-1 w-10 rounded-sm" />
          </div>
          <div className="flex w-full items-center gap-2">
            {illust && <Illust name={illust} size={illustSize} />}
            <h2 className="text-ink text-[20px] leading-tight font-bold">{title}</h2>
            <div className="flex-1" />
            <button type="button" aria-label="닫기" onClick={onClose} className="shrink-0 p-0.5">
              <CloseIcon size={22} />
            </button>
          </div>
          {description && <p className="text-ink-2 text-[13px] leading-normal">{description}</p>}
          {children}
        </div>
      </div>
    </div>,
    getFrameElement(),
  )
}
