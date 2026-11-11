import { createBrowserRouter } from 'react-router'

import { MobileLayout } from '@/layouts/MobileLayout'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { WelcomePage } from '@/pages/WelcomePage'

/**
 * 라우트는 기능별로 features/<기능>/routes.tsx 에 정의하고 여기서 모아요.
 * 예) ...onboardingRoutes, ...adminRoutes
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MobileLayout />,
    children: [
      { index: true, element: <WelcomePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
