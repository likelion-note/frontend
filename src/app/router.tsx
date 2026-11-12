import { createBrowserRouter } from 'react-router'

import { adminRoutes } from '@/features/admin/routes'
import { homeRoutes } from '@/features/home/routes'
import { meetingRoutes } from '@/features/meeting/routes'
import { onboardingRoutes } from '@/features/onboarding/routes'
import { MobileLayout } from '@/layouts/MobileLayout'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RootRedirect } from '@/pages/RootRedirect'

/**
 * 라우트는 기능별로 features/<기능>/routes.tsx 에 정의하고 여기서 모아요.
 * 아기사자 홈은 homeRoutes에서 관리해요.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MobileLayout />,
    children: [
      { index: true, element: <RootRedirect /> },
      ...onboardingRoutes,
      ...adminRoutes,
      ...homeRoutes,
      ...meetingRoutes,
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
