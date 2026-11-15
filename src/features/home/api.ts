import { api } from '@/api/client'
import { setRealTimeline, timelineFromStage, type StageDto } from '@/features/admin/timeline'
import type { Part } from '@/features/admin/types'

/**
 * 아기사자 홈 (실제 모드). GET /api/home
 * 서버가 계산한 현재 단계(주차 · D-day · 다음 정기 세션 · 프로젝트 기간 여부)를 받아
 * 홈 · 가이드 · 회의 · 하단 탭이 같이 읽는 타임라인에 넣어 둬요.
 * 운영진은 이 API 를 쓸 수 없어요 (403).
 */
export type HomeDto = {
  assignment: { projectId: number; projectTitle: string; part: Part } | null
  stage: StageDto
  stageLabel: string | null
  taskSummary: { done: number; total: number }
  opTip: string | null
}

export async function getHome(): Promise<HomeDto> {
  const home = await api.get<HomeDto>('/api/home')
  setRealTimeline(timelineFromStage(home.stage))
  return home
}
