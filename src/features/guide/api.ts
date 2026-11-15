import { api, USE_MOCK } from '@/api/client'
import { resourcePreviews } from '@/features/guide/mock/resourcePreviews'
import { getMockWeeklyGuide, guideResources } from '@/features/guide/mock/data'
import type { GuidePart, GuideResource, GuideTask, WeeklyGuide } from '@/features/guide/types'

/**
 * 파트 가이드 API.
 * - 목 모드: mock/data.ts 의 가이드
 * - 실제 모드: GET /api/guide?part=&stage= (할 일 · 자료 · 운영진 한마디를 한 번에 줘요)
 */

/* ---------- 실제 서버 ---------- */

/**
 * 서버의 주차 구간. 4~5주차가 하나로 묶여 있어서 화면의 '몇 번째 칸'(1~6)과 이 순서로 맞춰요.
 * 칸 번호 n ↔ GUIDE_STAGES[n - 1]
 */
export const GUIDE_STAGES = ['W1', 'W2', 'W3', 'W4_5', 'W6', 'W7'] as const

/** 실제 주차(1, 2, 3 …)가 몇 번째 칸인지. 4·5주차는 4번째, 6주차는 5번째, 7주차부터는 6번째 */
export function guideSlotOfWeek(week: number) {
  if (week <= 3) return Math.max(week, 1)
  if (week <= 5) return 4
  return week === 6 ? 5 : 6
}

type TaskDto = {
  key: string
  title: string
  day: string | null
  checked: boolean
  action: { type: 'DOC' | 'MEETING'; docKey: string | null; label: string } | null
}
type DocDto = { key: string; title: string; source: string; lines: string[] }
type GuideDto = {
  part: GuidePart
  stage: string
  currentStage: string | null
  stages: { stage: string; label: string }[]
  tasks: TaskDto[]
  docs: DocDto[]
  opTip: string | null
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

function toTask(dto: TaskDto): GuideTask {
  const day = dto.day ?? ''
  return {
    id: dto.key,
    title: dto.title,
    isCompleted: dto.checked,
    dueLabel: day,
    weekday: day,
    isDueToday: day === WEEKDAYS[new Date().getDay()],
    action: dto.action
      ? dto.action.type === 'MEETING'
        ? { label: `${dto.action.label} ›`, kind: 'meeting' }
        : {
            label: `${dto.action.label} ›`,
            kind: 'resources',
            resourceIds: dto.action.docKey ? [dto.action.docKey] : [],
          }
      : undefined,
  }
}

const toResource = (doc: DocDto, part: GuidePart, week: number): GuideResource => ({
  id: doc.key,
  part,
  week,
  title: doc.title,
  description: doc.source,
  teamName: doc.source,
  fileType: doc.title.toLowerCase().endsWith('.pdf') ? 'pdf' : 'other',
  fileUrl: null,
  previewTitle: doc.title.replace(/\.pdf$/i, ''),
  previewDescription: `${doc.source} · 운영진이 정리해 둔 실제 자료예요`,
  // 서버 자료는 줄마다 '1. ' 번호가 붙어 와요. 화면이 번호를 매기니까 떼요.
  previewItems: doc.lines.map((line) => line.replace(/^\d+\.\s*/, '')),
})

/** 자료 미리보기는 따로 조회하는 API 가 없어서, 가이드를 받을 때 본 자료를 기억해 둬요 */
const knownResources = new Map<string, GuideResource>()

async function fetchGuide(part: GuidePart, week: number) {
  const stage = GUIDE_STAGES[week - 1] ?? GUIDE_STAGES[0]
  const data = await api.get<GuideDto>(`/api/guide?part=${part}&stage=${stage}`)
  const resources = data.docs.map((doc) => toResource(doc, part, week))
  for (const resource of resources) knownResources.set(resource.id, resource)
  return { data, resources }
}

/* ---------- 화면이 부르는 함수 ---------- */

export async function getWeeklyGuide(part: GuidePart, week: number): Promise<WeeklyGuide | null> {
  if (USE_MOCK) return structuredClone(getMockWeeklyGuide(part, week))
  const { data, resources } = await fetchGuide(part, week)
  return {
    id: `${part}-${data.stage}`,
    part,
    week,
    tasks: data.tasks.map(toTask),
    featuredResourceIds: resources.slice(0, 1).map((resource) => resource.id),
    operatorMessage: { text: data.opTip ?? '' },
    weekLabels: data.stages.map((stage) => stage.label),
  }
}

export async function getGuideResources(part: GuidePart, week: number) {
  if (USE_MOCK) {
    return structuredClone(
      guideResources.filter((resource) => resource.part === part && resource.week === week),
    )
  }
  return (await fetchGuide(part, week)).resources
}

export async function getGuideResourceById(id: string) {
  if (USE_MOCK) {
    return structuredClone(resourcePreviews.find((resource) => resource.id === id) ?? null)
  }
  return knownResources.get(id) ?? null
}

/** 할 일 체크 (실제 모드). PUT /api/guide/checks/{key} */
export async function putGuideCheck(taskId: string, checked: boolean) {
  await api.put(`/api/guide/checks/${encodeURIComponent(taskId)}`, { checked })
}
