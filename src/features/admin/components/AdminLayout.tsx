import { Outlet } from 'react-router'

import { AdminTabBar } from '@/features/admin/components/AdminTabBar'

/** 운영진 탭 화면 틀: 모눈 배경 + 스크롤되는 내용 + 하단 탭 */
export function AdminLayout() {
  return (
    <div className="bg-paper flex h-full min-h-0 flex-col">
      <div className="paper-grid flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
        <Outlet />
      </div>
      <AdminTabBar />
    </div>
  )
}

/** 탭 없는 상세 화면 틀 (일지 검토, 프로필 설정) */
export function AdminDetailLayout() {
  return (
    <div className="paper-grid bg-paper flex h-full min-h-0 flex-col overflow-y-auto overscroll-contain">
      <Outlet />
    </div>
  )
}

/** 각 화면의 본문 영역. 좌우 20px, 세로 간격 14px */
export function AdminContent({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <main className={`flex w-full flex-1 flex-col gap-3.5 px-5 pt-3 pb-7 ${className}`}>
      {children}
    </main>
  )
}
