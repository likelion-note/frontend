import type { RouteObject } from 'react-router'

import { ScreenLayout } from '@/components/layout/Screen'
import { InviteCodePage } from '@/features/onboarding/pages/InviteCodePage'
import { ProfileSetupPage } from '@/features/onboarding/pages/ProfileSetupPage'
import { StartPage } from '@/features/onboarding/pages/StartPage'

/** 온보딩: 시작(구글 로그인) → 초대코드 → 프로필. 하단 탭 없음 */
export const onboardingRoutes: RouteObject[] = [
  {
    element: <ScreenLayout />,
    children: [
      { path: 'onboarding', element: <StartPage /> },
      { path: 'onboarding/code', element: <InviteCodePage /> },
      { path: 'onboarding/profile', element: <ProfileSetupPage /> },
    ],
  },
]
