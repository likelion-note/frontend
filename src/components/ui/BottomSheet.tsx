import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { CloseIcon } from '@/components/icons'
import { Illust, type IllustName } from '@/components/ui/Illust'
import { useBottomSheetDrag, type SheetDragOptions } from '@/hooks/useBottomSheetDrag'
import { cn } from '@/lib/cn'
import { getFrameElement } from '@/lib/frame'

type Props = {
  open: boolean
  onClose: () => void
  title: string
  illust?: IllustName
  illustSize?: number
  description?: ReactNode
  children: ReactNode
  className?: string
  headerIcon?: ReactNode
  closeIcon?: ReactNode
  titleClassName?: string
  handleClassName?: string
  overlayClassName?: string
  motion?: boolean
  /** 기존 화면은 기본 애니메이션을 유지하고 필요한 화면만 전체 높이 슬라이드를 사용해요. */
  slideFromBottom?: boolean
  slideDistance?: number
  animationDuration?: number
  dragOptions?: SheetDragOptions
}

export function BottomSheet({
  open,
  onClose,
  title,
  illust,
  illustSize = 36,
  description,
  children,
  className,
  headerIcon,
  closeIcon,
  titleClassName,
  handleClassName,
  overlayClassName,
  motion = false,
  slideFromBottom = false,
  slideDistance,
  animationDuration = 200,
  dragOptions,
}: Props) {
  const [mounted, setMounted] = useState(open)
  const [exiting, setExiting] = useState(false)
  const [entered, setEntered] = useState(!slideFromBottom)
  const dialogRef = useRef<HTMLDivElement>(null)
  const portalRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])
  const visible = motion ? open || mounted : open
  const duration =
    slideFromBottom && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 0
      : animationDuration
  const { reset: resetDrag, ...drag } = useBottomSheetDrag({
    enabled: motion && visible,
    dialogRef,
    onClose: () => onCloseRef.current(),
    options: dragOptions,
  })

  useEffect(() => {
    if (!motion) return
    if (open) {
      setMounted(true)
      setExiting(false)
      resetDrag()
      if (!slideFromBottom) return
      setEntered(false)
      let secondFrame = 0
      const firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => setEntered(true))
      })
      return () => {
        cancelAnimationFrame(firstFrame)
        cancelAnimationFrame(secondFrame)
      }
    }
    if (!mounted) return
    setExiting(true)
    const timeout = window.setTimeout(() => {
      setMounted(false)
      setExiting(false)
      setEntered(false)
      resetDrag()
    }, duration)
    return () => window.clearTimeout(timeout)
  }, [open, mounted, motion, slideFromBottom, duration, resetDrag])

  useEffect(() => {
    if (!visible) return
    const previousFocus = document.activeElement as HTMLElement | null
    const frame = getFrameElement()
    const background = motion
      ? Array.from(frame.children).filter(
          (element): element is HTMLElement =>
            element instanceof HTMLElement && element !== portalRef.current,
        )
      : []
    const previousInert = background.map((element) => element.inert)
    const scrolling = motion ? Array.from(frame.querySelectorAll<HTMLElement>('main')) : []
    const previousOverflow = scrolling.map((element) => element.style.overflowY)
    background.forEach((element) => {
      element.inert = true
    })
    scrolling.forEach((element) => {
      element.style.overflowY = 'hidden'
    })
    const focusTimer = motion
      ? window.setTimeout(() => dialogRef.current?.focus({ preventScroll: true }), 0)
      : undefined
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
      }
      if (!motion || event.key !== 'Tab') return
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), select:not(:disabled), input:not(:disabled), a[href], [tabindex="0"]',
      )
      if (!focusable?.length) {
        event.preventDefault()
        dialogRef.current?.focus({ preventScroll: true })
        return
      }
      const first = focusable[0],
        last = focusable[focusable.length - 1]
      const outside =
        !dialogRef.current?.contains(document.activeElement) ||
        document.activeElement === dialogRef.current
      if (event.shiftKey && (document.activeElement === first || outside)) {
        event.preventDefault()
        last.focus({ preventScroll: true })
      } else if (!event.shiftKey && (document.activeElement === last || outside)) {
        event.preventDefault()
        first.focus({ preventScroll: true })
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', onKey)
      background.forEach((element, index) => {
        element.inert = previousInert[index]
      })
      scrolling.forEach((element, index) => {
        element.style.overflowY = previousOverflow[index]
      })
      if (motion && previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [visible, motion])
  // 자료 목록에서 미리보기로 전환하는 등 내용이 바뀌어도 최초 트리거는 그대로 기억해요.
  useEffect(() => {
    if (visible && motion) dialogRef.current?.focus({ preventScroll: true })
  }, [title, visible, motion])

  if (!visible) return null
  return createPortal(
    <div ref={portalRef} className="absolute inset-0 z-50">
      <div className="relative h-full w-full">
        <button
          type="button"
          aria-label="바깥 영역을 눌러 닫기"
          onClick={onClose}
          className={cn(
            'bg-dim absolute inset-0 cursor-default transition-opacity',
            !slideFromBottom && 'animate-fade-in',
            overlayClassName,
          )}
          style={{
            transitionDuration: `${duration}ms`,
            opacity: slideFromBottom ? (entered && !exiting ? 1 : 0) : exiting ? 0 : undefined,
          }}
        />
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          tabIndex={-1}
          onPointerDown={(event) => drag.startPointer(event)}
          onPointerMove={(event) => drag.movePointer(event)}
          onPointerUp={(event) => drag.endPointer(event)}
          onPointerCancel={drag.cancelPointer}
          className={cn(
            'bg-paper no-scrollbar absolute inset-x-0 bottom-0 flex max-h-[92%] flex-col gap-3.5 overflow-y-auto overscroll-contain rounded-t-3xl px-5 pt-3 pb-[34px] outline-none',
            motion && '[&>*]:shrink-0',
            !exiting && !slideFromBottom && 'animate-sheet-up',
            className,
          )}
          style={
            motion
              ? {
                  transform: `translateY(${exiting || (slideFromBottom && !entered) ? (slideDistance === undefined ? '100%' : `${Math.max(slideDistance, drag.offset)}px`) : `${drag.offset}px`})`,
                  opacity: exiting || (slideFromBottom && !entered) ? 0 : 1,
                  transition: drag.dragging
                    ? 'none'
                    : `transform ${duration}ms ease, opacity ${duration}ms ease`,
                  userSelect: drag.dragging ? 'none' : undefined,
                }
              : undefined
          }
        >
          <div
            data-sheet-handle
            className={cn(
              'relative flex w-full touch-none justify-center',
              motion && 'before:absolute before:inset-x-0 before:-inset-y-2',
            )}
            onPointerDown={(event) => drag.startPointer(event, true)}
            onPointerMove={(event) => drag.movePointer(event, true)}
            onPointerUp={(event) => drag.endPointer(event, true)}
            onPointerCancel={drag.cancelPointer}
          >
            <div className={cn('bg-handle h-1 w-10 rounded-sm', handleClassName)} />
          </div>
          <div className="flex w-full items-center gap-2">
            {headerIcon ?? (illust && <Illust name={illust} size={illustSize} />)}
            <h2
              className={cn(
                'text-ink min-w-0 flex-1 text-[20px] leading-tight font-bold [overflow-wrap:anywhere]',
                titleClassName,
              )}
            >
              {title}
            </h2>
            <button
              type="button"
              aria-label="닫기"
              onClick={onClose}
              className={cn(
                'relative shrink-0 before:absolute before:-inset-2',
                !closeIcon && 'p-0.5',
              )}
            >
              {closeIcon ?? <CloseIcon size={22} />}
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
