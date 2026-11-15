import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react'

export interface SheetDragOptions {
  threshold?: number
  velocity?: number
  fromContent?: boolean
}
type Origin = {
  source: 'pointer' | 'touch'
  id: number
  handle: boolean
  active: boolean
  x: number
  y: number
  samples: { y: number; time: number }[]
  lastTime: number
  velocity: number
}

/** 핸들은 바로 이동하고, 본문은 스크롤 최상단의 명확한 아래 방향 동작만 가로채요. */
export function useBottomSheetDrag({
  enabled,
  dialogRef,
  onClose,
  options,
}: {
  enabled: boolean
  dialogRef: RefObject<HTMLDivElement | null>
  onClose: () => void
  options?: SheetDragOptions
}) {
  const threshold = options?.threshold ?? 70
  const velocityThreshold = options?.velocity ?? Infinity
  const fromContent = options?.fromContent ?? false
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const origin = useRef<Origin | null>(null)
  const offsetRef = useRef(0)
  const closeRef = useRef(onClose)
  useEffect(() => {
    closeRef.current = onClose
  }, [onClose])

  const reset = useCallback(() => {
    origin.current = null
    offsetRef.current = 0
    setOffset(0)
    setDragging(false)
  }, [])
  const move = useCallback((x: number, y: number, now: number) => {
    const start = origin.current
    if (!start) return false
    const dx = x - start.x,
      dy = y - start.y
    if (!start.active) {
      if (dy < -6 || (Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy) * 1.2)) {
        origin.current = null
        return false
      }
      if (dy < 6 || dy <= Math.abs(dx) * 1.2) return false
      start.active = true
      setDragging(true)
    }
    start.samples.push({ y, time: now })
    while (start.samples.length > 2 && start.samples[1].time < now - 100) start.samples.shift()
    const first = start.samples[0]
    start.velocity = (y - first.y) / Math.max(1, now - first.time)
    start.lastTime = now
    offsetRef.current = Math.max(0, dy)
    setOffset(offsetRef.current)
    return true
  }, [])
  const finish = useCallback(
    (now: number) => {
      const start = origin.current
      if (!start) return
      origin.current = null
      setDragging(false)
      const velocity = now - start.lastTime < 130 ? start.velocity : 0
      if (
        start.active &&
        (offsetRef.current >= threshold ||
          (offsetRef.current >= 20 && velocity >= velocityThreshold))
      )
        closeRef.current()
      else {
        offsetRef.current = 0
        setOffset(0)
      }
    },
    [threshold, velocityThreshold],
  )
  function interactive(target: EventTarget | null) {
    return (
      target instanceof Element &&
      !!target.closest(
        'button, a, input, select, textarea, [contenteditable="true"], [data-sheet-no-drag]',
      )
    )
  }
  function startPointer(event: ReactPointerEvent<HTMLDivElement>, handle = false) {
    if (!enabled || !event.isPrimary || event.button !== 0) return
    if (
      !handle &&
      (!fromContent ||
        event.pointerType === 'touch' ||
        interactive(event.target) ||
        (event.target instanceof Element && event.target.closest('[data-sheet-handle]')) ||
        (dialogRef.current?.scrollTop ?? 0) > 0)
    )
      return
    origin.current = {
      source: 'pointer',
      id: event.pointerId,
      handle,
      active: handle,
      x: event.clientX,
      y: event.clientY,
      samples: [{ y: event.clientY, time: event.timeStamp }],
      lastTime: event.timeStamp,
      velocity: 0,
    }
    if (handle) {
      setDragging(true)
      event.preventDefault()
      event.currentTarget.setPointerCapture(event.pointerId)
    }
  }
  function movePointer(event: ReactPointerEvent<HTMLDivElement>, handle = false) {
    const start = origin.current
    if (start?.source !== 'pointer' || start.id !== event.pointerId || start.handle !== handle)
      return
    if (move(event.clientX, event.clientY, event.timeStamp)) {
      event.preventDefault()
      if (!event.currentTarget.hasPointerCapture(event.pointerId))
        event.currentTarget.setPointerCapture(event.pointerId)
    }
  }
  function endPointer(event: ReactPointerEvent<HTMLDivElement>, handle = false) {
    const start = origin.current
    if (start?.source === 'pointer' && start.id === event.pointerId && start.handle === handle)
      finish(event.timeStamp)
  }
  function cancelPointer(event: ReactPointerEvent<HTMLDivElement>) {
    if (origin.current?.source === 'pointer' && origin.current.id === event.pointerId) reset()
  }

  useEffect(() => {
    const element = dialogRef.current
    if (!enabled || !fromContent || !element) return
    const start = (event: TouchEvent) => {
      if (
        event.touches.length !== 1 ||
        element.scrollTop > 0 ||
        interactive(event.target) ||
        (event.target instanceof Element && event.target.closest('[data-sheet-handle]'))
      )
        return
      const touch = event.touches[0]
      origin.current = {
        source: 'touch',
        id: touch.identifier,
        handle: false,
        active: false,
        x: touch.clientX,
        y: touch.clientY,
        samples: [{ y: touch.clientY, time: event.timeStamp }],
        lastTime: event.timeStamp,
        velocity: 0,
      }
    }
    const touchMove = (event: TouchEvent) => {
      if (origin.current?.source !== 'touch') return
      if (event.touches.length !== 1) {
        reset()
        return
      }
      const touch = Array.from(event.touches).find((item) => item.identifier === origin.current?.id)
      if (touch && move(touch.clientX, touch.clientY, event.timeStamp) && event.cancelable)
        event.preventDefault()
    }
    const end = (event: TouchEvent) => {
      if (origin.current?.source === 'touch') finish(event.timeStamp)
    }
    const cancel = () => {
      if (origin.current?.source === 'touch') reset()
    }
    element.addEventListener('touchstart', start, { passive: true })
    element.addEventListener('touchmove', touchMove, { passive: false })
    element.addEventListener('touchend', end)
    element.addEventListener('touchcancel', cancel)
    return () => {
      element.removeEventListener('touchstart', start)
      element.removeEventListener('touchmove', touchMove)
      element.removeEventListener('touchend', end)
      element.removeEventListener('touchcancel', cancel)
    }
  }, [enabled, fromContent, dialogRef, move, finish, reset])

  return { offset, dragging, reset, startPointer, movePointer, endPointer, cancelPointer }
}
