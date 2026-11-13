import { createBrowserRouter } from 'react-router'

import { AssignmentBoundary } from '@/features/assignment/AssignmentBoundary'
import { adminRoutes } from '@/features/admin/routes'
import { homeRoutes } from '@/features/home/routes'
import { guideRoutes } from '@/features/guide/routes'
import { meetingRoutes } from '@/features/meeting/routes'
import { noteRoutes } from '@/features/note/routes'
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
      {
        element: <AssignmentBoundary />,
        children: [...homeRoutes, ...guideRoutes, ...meetingRoutes],
      },
      // 노트는 배정 정보가 없어도 열리고 운영진도 같이 써서 AssignmentBoundary 밖에 둬요.
      ...noteRoutes,
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
