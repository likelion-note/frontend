import type { RouteObject } from 'react-router'

/**
 * 노트 라우트. 아직 app/router.tsx에 합치지 않았어요 (README의 '연결 방법' 참고).
 * 합칠 때 admin/routes.tsx의 `notes` 준비 중 화면을 지워야 이 경로가 열려요.
 */
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
