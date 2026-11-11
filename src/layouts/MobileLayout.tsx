import { Outlet } from 'react-router'

/**
 * 모바일 전용 레이아웃.
 * - 폰(480px 미만): 화면에 꽉 차게
 * - PC: 가운데 390px 폰 프레임. 높이는 브라우저 창을 넘지 않고 내용은 프레임 안에서 스크롤해요
 * 바텀시트·토스트는 #mobile-frame 안으로 포털돼요 (lib/frame.ts)
 */
export function MobileLayout() {
  return (
    <div className="h-dvh w-full sm:flex sm:items-center sm:justify-center sm:px-4 sm:py-6">
      <div
        id="mobile-frame"
        className="max-w-mobile bg-paper sm:shadow-phone relative mx-auto flex h-dvh w-full flex-col overflow-hidden sm:h-[min(844px,calc(100dvh-48px))] sm:rounded-[32px] sm:ring-1 sm:ring-black/5"
      >
        <Outlet />
      </div>
    </div>
  )
}
