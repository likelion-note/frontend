import type { RouteObject } from 'react-router'
import { MeetingPage } from '@/features/meeting/pages/MeetingPage'
export const meetingRoutes: RouteObject[] = [
  { path: 'meeting', element: <MeetingPage /> },
  {
    path: 'meeting/history',
    lazy: async () => ({
      Component: (await import('@/features/meeting/pages/PreviousMeetingsPage'))
        .PreviousMeetingsPage,
    }),
  },
  {
    path: 'meeting/summary/:id',
    lazy: async () => ({
      Component: (await import('@/features/meeting/pages/MeetingSummaryPage')).MeetingSummaryPage,
    }),
  },
  {
    path: 'meeting/summary/:id/complete',
    lazy: async () => ({
      Component: (await import('@/features/meeting/pages/MeetingSummaryCompletePage'))
        .MeetingSummaryCompletePage,
    }),
  },
]
