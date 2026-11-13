import type { RouteObject } from 'react-router'

/** 노트 라우트. 아기사자와 운영진의 노트 탭이 같이 써요. */
export const noteRoutes: RouteObject[] = [
  {
    path: 'notes',
    lazy: async () => ({
      Component: (await import('@/features/note/pages/NoteBoardPage')).NoteBoardPage,
    }),
  },
  {
    path: 'notes/:id',
    lazy: async () => ({
      Component: (await import('@/features/note/pages/NoteDetailPage')).NoteDetailPage,
    }),
  },
]
