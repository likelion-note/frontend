import type { RouteObject } from 'react-router'
export const guideRoutes: RouteObject[] = [
  {
    path: 'guide',
    lazy: async () => ({
      Component: (await import('@/features/guide/pages/PartGuidePage')).PartGuidePage,
    }),
  },
]
