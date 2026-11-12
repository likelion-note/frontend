import { useRef, type MouseEvent, type PointerEvent } from 'react'
/** 세로 스크롤은 브라우저에 맡기고 명확한 가로 제스처만 유형 전환으로 처리해요. */
export function useMeetingSwipe(onSwipe: (direction: number) => void) {
  const start = useRef<{ x: number; y: number; id: number; time: number } | null>(null)
  const suppressClickUntil = useRef(0)
  return {
    onPointerDown(event: PointerEvent<HTMLElement>) {
      if (
        !event.isPrimary ||
        event.button !== 0 ||
        (event.target as HTMLElement).closest('[data-no-swipe]')
      )
        return
      start.current = { x: event.clientX, y: event.clientY, id: event.pointerId, time: Date.now() }
    },
    onPointerUp(event: PointerEvent<HTMLElement>) {
      const origin = start.current
      start.current = null
      if (!origin || origin.id !== event.pointerId) return
      const dx = event.clientX - origin.x,
        dy = event.clientY - origin.y
      if (
        Math.abs(dx) >= 48 &&
        Math.abs(dx) > Math.abs(dy) * 1.5 &&
        Date.now() - origin.time < 1000
      ) {
        suppressClickUntil.current = Date.now() + 350
        event.preventDefault()
        onSwipe(dx < 0 ? 1 : -1)
      }
    },
    onPointerCancel() {
      start.current = null
    },
    onClickCapture(event: MouseEvent<HTMLElement>) {
      if (Date.now() < suppressClickUntil.current) {
        event.preventDefault()
        event.stopPropagation()
      }
    },
  }
}
