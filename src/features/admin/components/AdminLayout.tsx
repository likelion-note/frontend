import { Outlet } from 'react-router'

import { BottomNav } from '@/components/common/BottomNav'

/** 운영진 탭 화면 틀: 헤더(고정) + 본문(스크롤, AdminContent) + 하단 탭. 모눈 배경은 프레임(MobileLayout)에 깔려 있어요 */
export function AdminLayout() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  )
}

/** 탭 없는 상세 화면 틀 (일지 검토, 프로필 설정) */
export function AdminDetailLayout() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <Outlet />
    </div>
  )
}

/** 각 화면의 본문 영역. 헤더 아래에서 이 영역만 스크롤돼요. 좌우 20px, 세로 간격 14px */
export function AdminContent({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <main
      className={`no-scrollbar flex min-h-0 w-full flex-1 flex-col gap-3.5 overflow-y-auto overscroll-contain px-5 pt-3 pb-7 [&>*]:shrink-0 ${className}`}
    >
      {children}
    </main>
  )
}
