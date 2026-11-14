import { createBrowserRouter, Navigate } from 'react-router'

import { GuestOnly, RequireAuth, RequireRole } from '@/app/guards'
import { ScreenLayout } from '@/components/layout/Screen'
import { AssignmentBoundary } from '@/features/assignment/AssignmentBoundary'
import { adminRoutes } from '@/features/admin/routes'
import { homeRoutes } from '@/features/home/routes'
import { guideRoutes } from '@/features/guide/routes'
import { journalRoutes } from '@/features/journal/routes'
import { meetingRoutes } from '@/features/meeting/routes'
import { noteRoutes } from '@/features/note/routes'
import { onboardingRoutes } from '@/features/onboarding/routes'
import { MobileLayout } from '@/layouts/MobileLayout'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { RootRedirect } from '@/pages/RootRedirect'

/**
 * 라우트는 기능별로 features/<기능>/routes.tsx 에 정의하고 여기서 모아요.
 *
 * 접근 규칙 (app/guards.tsx)
 * - 온보딩: 로그인 전에만. 로그인했으면 자기 첫 화면으로
 * - 운영진 화면(검토 · 멤버 · 운영): 운영진만
 * - 홈 · 가이드 · 회의: 아기사자만 (운영진은 첫 탭이 검토)
 * - 노트 · 내 기록 · 프로필 설정: 로그인한 모두
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MobileLayout />,
    children: [
      { index: true, element: <RootRedirect /> },
      { element: <GuestOnly />, children: onboardingRoutes },
      {
        element: <RequireAuth />,
        children: [
          { element: <RequireRole role="ADMIN" />, children: adminRoutes },
          {
            element: <RequireRole role="MEMBER" />,
            children: [
              {
                element: <AssignmentBoundary />,
                children: [...homeRoutes, ...guideRoutes, ...meetingRoutes],
              },
            ],
          },
          // 노트 · 내 기록은 배정 정보가 없어도 열리고 운영진도 같이 써요.
          ...noteRoutes,
          ...journalRoutes,
          {
            element: <ScreenLayout />,
            children: [{ path: 'profile', element: <ProfilePage /> }],
          },
          // 예전 주소
          { path: 'admin/profile', element: <Navigate to="/profile" replace /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
