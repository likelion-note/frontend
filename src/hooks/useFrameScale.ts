import { useEffect, useState } from 'react'

/** 피그마 화면 크기. PC 폰 프레임은 이 크기를 기준으로 그려요 */
export const FRAME_WIDTH = 390
export const FRAME_HEIGHT = 844
/** 프레임 위아래 여백(32px씩) + 테두리(2px씩) */
const VERTICAL_MARGIN = 32 * 2 + 2 * 2
const HORIZONTAL_MARGIN = 16 * 2 + 2 * 2

const DESKTOP_QUERY = '(min-width: 640px)'

function compute(): number {
  if (!window.matchMedia(DESKTOP_QUERY).matches) return 1
  const byHeight = (window.innerHeight - VERTICAL_MARGIN) / FRAME_HEIGHT
  const byWidth = (window.innerWidth - HORIZONTAL_MARGIN) / FRAME_WIDTH
  return Math.max(0.3, Math.min(1, byHeight, byWidth))
}

/**
 * PC 에서 폰 프레임을 브라우저 창에 맞춰 통째로 줄이는 배율.
 * 창이 충분히 크면 1, 작으면 비율을 유지한 채 글자·여백까지 같이 줄어요.
 * 폰(640px 미만)에서는 항상 1.
 */
export function useFrameScale(): number {
  const [scale, setScale] = useState(() => (typeof window === 'undefined' ? 1 : compute()))

  useEffect(() => {
    const update = () => setScale(compute())
    const mq = window.matchMedia(DESKTOP_QUERY)
    update()
    window.addEventListener('resize', update)
    mq.addEventListener('change', update)
    return () => {
      window.removeEventListener('resize', update)
      mq.removeEventListener('change', update)
    }
  }, [])

  return scale
}
