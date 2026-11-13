import { useQuery, useQueryClient } from '@tanstack/react-query'

import { useMyAssignment } from '@/features/assignment/useMyAssignment'
import {
  getMyJournal,
  getMyJournals,
  getMyProjects,
  getPortfolioQuota,
  getPortfolioSummary,
} from '@/features/journal/api'
import { currentCohort } from '@/features/note/mock/data'
import type { MyJournal, PortfolioFormat } from '@/features/journal/types'

/** 목록 · 상세 · 포트폴리오가 같은 조회 결과를 봐요. 저장하면 refresh로 다 같이 갱신해요. */
export function useMyJournals() {
  return useQuery({ queryKey: ['journal', 'list'], queryFn: getMyJournals })
}
export function useMyJournal(id: string) {
  return useQuery({ queryKey: ['journal', 'detail', id], queryFn: () => getMyJournal(id) })
}
export function useMyProjects() {
  return useQuery({ queryKey: ['journal', 'projects'], queryFn: getMyProjects })
}
export function usePortfolioQuota() {
  return useQuery({ queryKey: ['journal', 'portfolio', 'quota'], queryFn: getPortfolioQuota })
}
export function usePortfolioSummary(projectId: string, format: PortfolioFormat) {
  return useQuery({
    queryKey: ['journal', 'portfolio', 'summary', projectId, format],
    queryFn: () => getPortfolioSummary(projectId, format),
  })
}

/** 저장한 일지를 상세 캐시에 바로 넣고 목록 · 포트폴리오는 다시 불러요. */
export function useJournalCache() {
  const client = useQueryClient()
  return {
    put(journal: MyJournal) {
      client.setQueryData(['journal', 'detail', journal.id], journal)
      void client.invalidateQueries({ queryKey: ['journal', 'list'] })
    },
    refreshPortfolio() {
      void client.invalidateQueries({ queryKey: ['journal', 'portfolio'] })
    },
  }
}

/** 새 일지의 기본값과 공개 범위 문구에 쓰는 내 배정 정보. 홈 · 가이드와 같은 데이터예요. */
export function useJournalContext() {
  const assignment = useMyAssignment()
  const data = assignment.data
  return {
    /** 배정 정보를 다 불러왔는지(실패 포함). 새 일지는 이걸 기다렸다 기본값을 채워요. */
    ready: !assignment.isPending,
    cohort: data?.cohort ?? currentCohort,
    part: data?.assignmentStatus === 'ASSIGNED' ? data.part : null,
    teamName: data?.teamName ?? null,
  }
}
