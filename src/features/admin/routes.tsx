import { Navigate, type RouteObject } from 'react-router'

import { AdminDetailLayout, AdminLayout } from '@/features/admin/components/AdminLayout'
import { MembersPage } from '@/features/admin/pages/MembersPage'
import { OpsPage } from '@/features/admin/pages/OpsPage'
import { ReviewDetailPage } from '@/features/admin/pages/ReviewDetailPage'
import { ReviewHomePage } from '@/features/admin/pages/ReviewHomePage'

/**
 * 운영진 라우트.
 * 탭이 있는 화면은 AdminLayout 아래, 일지 검토처럼 탭이 없는 화면은 AdminDetailLayout 아래에 둬요.
 * 노트(/notes) · 내 기록(/me) · 프로필 설정(/profile)은 아기사자와 같이 써서 app/router.tsx 에 있어요.
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
    ],
  },
  {
    element: <AdminDetailLayout />,
    children: [{ path: 'admin/review/:id', element: <ReviewDetailPage /> }],
  },
]
