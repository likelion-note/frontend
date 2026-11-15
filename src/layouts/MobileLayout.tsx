import { useEffect, useRef } from 'react'
import { Outlet } from 'react-router'

import { useFrameScale } from '@/hooks/useFrameScale'

/**
 * 모바일 전용 레이아웃.
 * - 폰(640px 미만): 화면에 꽉 차게. 맨 위는 기기 안전 영역만큼 띄워요
 * - PC: 피그마와 같은 390×844 폰 프레임을 위 32px 여백에 두고, 창이 작으면 프레임 전체를
 *   비율대로 줄여요(zoom). 그래서 페이지 스크롤 없이 항상 다 보여요
 * - 화면은 세로로만 스크롤해요 (styles/index.css 의 가로 넘침 차단 + 아래 위치 고정)
 * 바텀시트·토스트는 #mobile-frame 안으로 포털돼요 (lib/frame.ts)
 */
export function MobileLayout() {
  const scale = useFrameScale()
  const frameRef = useRef<HTMLDivElement>(null)

  // 세로로만 스크롤해요. 어떤 이유로든 본문이 옆으로 밀리면 바로 제자리로 돌려요.
  // (칩 줄처럼 일부러 가로로 미는 영역은 overflow-x-auto 를 달고 있어서 그대로 둬요)
  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const keepInPlace = (event: Event) => {
      const target = event.target
      if (!(target instanceof HTMLElement) || target.scrollLeft === 0) return
      if (getComputedStyle(target).overflowX === 'auto') return
      target.scrollLeft = 0
    }
    frame.addEventListener('scroll', keepInPlace, { capture: true, passive: true })
    return () => frame.removeEventListener('scroll', keepInPlace, { capture: true })
  }, [])

  return (
    <div className="h-dvh w-full overflow-hidden sm:flex sm:items-start sm:justify-center sm:px-4 sm:pt-8">
      <div
        id="mobile-frame"
        ref={frameRef}
        style={scale < 1 ? { zoom: scale } : undefined}
        className="max-w-mobile bg-paper paper-grid border-ink relative mx-auto flex h-dvh w-full flex-col overflow-hidden sm:h-[844px] sm:w-[390px] sm:rounded-[40px] sm:border-2"
      >
        {/* 상태바 자리. 폰에서는 기기 안전 영역만큼, PC 프레임에서는 둥근 모서리에 닿지 않을 만큼만 띄워요 */}
        <div aria-hidden className="h-[env(safe-area-inset-top)] w-full shrink-0 sm:h-3.5" />
        <div className="flex min-h-0 flex-1 flex-col">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
