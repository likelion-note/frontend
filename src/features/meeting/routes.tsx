import type { RouteObject } from 'react-router'
import { MeetingPage } from '@/features/meeting/pages/MeetingPage'
import { PreviousMeetingsPage } from '@/features/meeting/pages/PreviousMeetingsPage'
export const meetingRoutes: RouteObject[] = [
  { path: 'meeting', element: <MeetingPage /> },
  { path: 'meeting/history', element: <PreviousMeetingsPage /> },
]
