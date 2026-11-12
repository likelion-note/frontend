import { useEffect, useRef, useState, type ReactNode } from 'react'
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
  description?: ReactNode
  children: ReactNode
  className?: string
  headerIcon?: ReactNode
  closeIcon?: ReactNode
  titleClassName?: string
  handleClassName?: string
  overlayClassName?: string
  /** 새 화면에서 닫힘 애니메이션, 포커스/스크롤 잠금, 드래그 닫기를 활성화해요. */
  motion?: boolean
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
}: Props) {
  const [mounted, setMounted] = useState(open)
  const [exiting, setExiting] = useState(false)
  const [dragY, setDragY] = useState(0)
  const dialogRef = useRef<HTMLDivElement>(null)
  const portalRef = useRef<HTMLDivElement>(null)
  const dragStart = useRef<number | null>(null)
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])
  const visible = motion ? open || mounted : open
  useEffect(() => {
    if (!motion) return
    if (open) {
      setMounted(true)
      setExiting(false)
      setDragY(0)
      return
    }
    if (!mounted) return
    setExiting(true)
    const timeout = window.setTimeout(() => {
      setMounted(false)
      setExiting(false)
      setDragY(0)
    }, 200)
    return () => window.clearTimeout(timeout)
  }, [open, mounted, motion])
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
    const focusTimer = motion ? window.setTimeout(() => dialogRef.current?.focus(), 0) : undefined
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
        dialogRef.current?.focus()
        return
      }
      const first = focusable[0],
        last = focusable[focusable.length - 1]
      if (
        event.shiftKey &&
        (document.activeElement === first || document.activeElement === dialogRef.current)
      ) {
        event.preventDefault()
        last.focus()
      } else if (
        !event.shiftKey &&
        (document.activeElement === last || document.activeElement === dialogRef.current)
      ) {
        event.preventDefault()
        first.focus()
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
  if (!visible) return null
  return createPortal(
    <div ref={portalRef} className="absolute inset-0 z-50">
      <div className="relative h-full w-full">
        <button
          type="button"
          aria-label="바깥 영역을 눌러 닫기"
          onClick={onClose}
          className={cn(
            'animate-fade-in bg-dim absolute inset-0 cursor-default transition-opacity duration-200',
            overlayClassName,
          )}
          style={exiting ? { opacity: 0 } : undefined}
        />
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          tabIndex={-1}
          className={cn(
            'bg-paper no-scrollbar absolute inset-x-0 bottom-0 flex max-h-[92%] flex-col gap-3.5 overflow-y-auto overscroll-contain rounded-t-3xl px-5 pt-3 pb-[34px] outline-none',
            motion && '[&>*]:shrink-0',
            !exiting && 'animate-sheet-up',
            className,
          )}
          style={
            motion
              ? {
                  transform: `translateY(${exiting ? '100%' : `${dragY}px`})`,
                  opacity: exiting ? 0 : 1,
                  transition: 'transform 200ms ease, opacity 200ms ease',
                }
              : undefined
          }
        >
          <div
            className="flex w-full touch-none justify-center"
            onPointerDown={
              motion
                ? (event) => {
                    dragStart.current = event.clientY
                    event.currentTarget.setPointerCapture(event.pointerId)
                  }
                : undefined
            }
            onPointerMove={
              motion
                ? (event) => {
                    if (dragStart.current !== null)
                      setDragY(Math.max(0, event.clientY - dragStart.current))
                  }
                : undefined
            }
            onPointerUp={
              motion
                ? () => {
                    if (dragY > 70) onClose()
                    else setDragY(0)
                    dragStart.current = null
                  }
                : undefined
            }
            onPointerCancel={() => {
              dragStart.current = null
              setDragY(0)
            }}
          >
            <div className={cn('bg-handle h-1 w-10 rounded-sm', handleClassName)} />
          </div>
          <div className="flex w-full items-center gap-2">
            {headerIcon ?? (illust && <Illust name={illust} size={illustSize} />)}
            <h2 className={cn('text-ink text-[20px] leading-tight font-bold', titleClassName)}>
              {title}
            </h2>
            <div className="flex-1" />
            <button
              type="button"
              aria-label="닫기"
              onClick={onClose}
              className={cn('shrink-0', !closeIcon && 'p-0.5')}
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
