import { Navigate, type RouteObject } from 'react-router'

import { AdminDetailLayout, AdminLayout } from '@/features/admin/components/AdminLayout'
import { MembersPage } from '@/features/admin/pages/MembersPage'
import { OpsPage } from '@/features/admin/pages/OpsPage'
import { ReviewDetailPage } from '@/features/admin/pages/ReviewDetailPage'
import { ReviewHomePage } from '@/features/admin/pages/ReviewHomePage'
import { ComingSoonPage } from '@/pages/ComingSoonPage'

/**
 * 운영진 라우트.
 * 탭이 있는 화면은 AdminLayout 아래, 일지 검토처럼 탭이 없는 화면은 AdminDetailLayout 아래에 둬요.
 * 노트 · 내 기록 탭은 아기사자 화면과 같아서 그쪽이 준비되면 연결만 바꿔요.
 */
export const adminRoutes: RouteObject[] = [
  {
    element: <AdminLayout />,
    children: [
      { path: 'admin', element: <Navigate to="/admin/review" replace /> },
      { path: 'admin/review', element: <ReviewHomePage /> },
      { path: 'admin/members', element: <MembersPage /> },
      { path: 'admin/ops', element: <Navigate to="/admin/ops/schedule" replace /> },
      { path: 'admin/ops/:tab', element: <OpsPage /> },
      { path: 'notes', element: <ComingSoonPage title="노트" /> },
      { path: 'me', element: <ComingSoonPage title="내 기록" /> },
    ],
  },
  {
    element: <AdminDetailLayout />,
    children: [{ path: 'admin/review/:id', element: <ReviewDetailPage /> }],
  },
]
