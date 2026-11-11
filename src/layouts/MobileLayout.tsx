import { Outlet } from 'react-router'

/**
 * 모바일 전용 레이아웃. PC 에서는 가운데 390px 폭으로 보여요.
 * 하단 탭바 등은 각 역할(아기사자/운영진) 레이아웃에서 따로 붙여요.
 */
export function MobileLayout() {
  return (
    <div className="min-h-dvh">
      <div
        id="mobile-frame"
        className="max-w-mobile bg-paper relative mx-auto flex min-h-dvh w-full flex-col shadow-sm"
      >
        <Outlet />
      </div>
    </div>
  )
}
