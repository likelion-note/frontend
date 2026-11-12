import type { RouteObject } from 'react-router'

import { HomePage } from '@/features/home/pages/HomePage'

export const homeRoutes: RouteObject[] = [{ path: 'home', element: <HomePage /> }]
