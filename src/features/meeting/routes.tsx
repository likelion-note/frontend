import type { RouteObject } from 'react-router'
export const meetingRoutes: RouteObject[] = [
  {
    path: 'meeting',
    lazy: async () => ({
      Component: (await import('@/features/meeting/pages/MeetingPage')).MeetingPage,
    }),
  },
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
