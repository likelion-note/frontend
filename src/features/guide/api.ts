import { resourcePreviews } from '@/features/guide/mock/resourcePreviews'
import { getMockWeeklyGuide, guideResources } from '@/features/guide/mock/data'
import type { GuidePart } from '@/features/guide/types'

/** 실제 API가 정해지면 이 함수들의 내부만 교체해요. 존재하지 않는 요청은 보내지 않아요. */
export async function getWeeklyGuide(part: GuidePart, week: number) {
  return structuredClone(getMockWeeklyGuide(part, week))
}
export async function getGuideResources(part: GuidePart, week: number) {
  return structuredClone(
    guideResources.filter((resource) => resource.part === part && resource.week === week),
  )
}
export async function getGuideResourceById(id: string) {
  return structuredClone(resourcePreviews.find((resource) => resource.id === id) ?? null)
}
