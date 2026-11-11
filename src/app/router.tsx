import { createBrowserRouter } from 'react-router'

import { ScreenLayout } from '@/components/layout/Screen'
import { adminRoutes } from '@/features/admin/routes'
import { onboardingRoutes } from '@/features/onboarding/routes'
import { MobileLayout } from '@/layouts/MobileLayout'
import { ComingSoonPage } from '@/pages/ComingSoonPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RootRedirect } from '@/pages/RootRedirect'

/**
 * 라우트는 기능별로 features/<기능>/routes.tsx 에 정의하고 여기서 모아요.
 * 아기사자 홈(/home)은 그쪽 화면이 준비되면 바꿔 끼워요.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MobileLayout />,
    children: [
      { index: true, element: <RootRedirect /> },
      ...onboardingRoutes,
      ...adminRoutes,
      {
        element: <ScreenLayout />,
        children: [{ path: 'home', element: <ComingSoonPage title="아기사자 홈" /> }],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
