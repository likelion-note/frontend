import type { RouteObject } from 'react-router'

/**
 * 내 기록 라우트. 아기사자와 운영진의 '내 기록' 탭이 같이 써요.
 * 쓰기 → AI 정리 중 → 미리보기 → 검토 요청 순서로 같은 일지 id를 이어 가요.
 */
export const journalRoutes: RouteObject[] = [
  {
    path: 'me',
    lazy: async () => ({
      Component: (await import('@/features/journal/pages/MyRecordPage')).MyRecordPage,
    }),
  },
  {
    path: 'me/journal/new',
    lazy: async () => ({
      Component: (await import('@/features/journal/pages/JournalNewPage')).JournalNewPage,
    }),
  },
  {
    path: 'me/journal/:id',
    lazy: async () => ({
      Component: (await import('@/features/journal/pages/JournalDetailPage')).JournalDetailPage,
    }),
  },
  {
    path: 'me/journal/:id/edit',
    lazy: async () => ({
      Component: (await import('@/features/journal/pages/JournalWritePage')).JournalWritePage,
    }),
  },
  {
    path: 'me/journal/:id/organizing',
    lazy: async () => ({
      Component: (await import('@/features/journal/pages/JournalOrganizingPage'))
        .JournalOrganizingPage,
    }),
  },
  {
    path: 'me/journal/:id/preview',
    lazy: async () => ({
      Component: (await import('@/features/journal/pages/JournalPreviewPage')).JournalPreviewPage,
    }),
  },
  {
    path: 'me/portfolio/:projectId',
    lazy: async () => ({
      Component: (await import('@/features/journal/pages/PortfolioResultPage')).PortfolioResultPage,
    }),
  },
]
