import { createBrowserRouter, Navigate } from 'react-router'

import { adminRoutes } from '@/features/admin/routes'
import { MobileLayout } from '@/layouts/MobileLayout'
import { NotFoundPage } from '@/pages/NotFoundPage'

/**
 * 라우트는 기능별로 features/<기능>/routes.tsx 에 정의하고 여기서 모아요.
 * 온보딩이 붙기 전까지는 첫 화면을 운영진 검토 홈으로 보내요.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MobileLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/review" replace /> },
      ...adminRoutes,
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
