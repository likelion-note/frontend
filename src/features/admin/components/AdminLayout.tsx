import { Outlet } from 'react-router'

import { AdminTabBar } from '@/features/admin/components/AdminTabBar'

/** 운영진 탭 화면 틀: 모눈 배경 + 내용 + 하단 탭 */
export function AdminLayout() {
  return (
    <div className="bg-paper flex min-h-dvh flex-col">
      <div className="paper-grid flex flex-1 flex-col">
        <Outlet />
      </div>
      <AdminTabBar />
    </div>
  )
}

/** 탭 없는 상세 화면 틀 (일지 검토) */
export function AdminDetailLayout() {
  return (
    <div className="paper-grid bg-paper flex min-h-dvh flex-col">
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
