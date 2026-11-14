import { MOCK_COHORT, store } from '@/features/admin/mock/store'
import {
  readJournal,
  readJournals,
  SEED_OWNER_ID,
  writeJournal,
} from '@/features/journal/journalStore'
import { myProjects } from '@/features/journal/mock/data'
import { appendFollowUp, organizeJournal, summarizePortfolio } from '@/features/journal/organize'
import { createSummary, readSummary, remainingToday } from '@/features/journal/portfolioStore'
import type {
  MyJournal,
  MyProject,
  PortfolioFormat,
  PortfolioSummary,
} from '@/features/journal/types'
import { getCurrentUser } from '@/lib/currentUser'
import { localDateString } from '@/features/meeting/meetingDates'

/**
 * 실제 API 엔드포인트가 정해지면 각 함수의 내부만 교체해요.
 * 지금은 브라우저 저장소(journalStore · portfolioStore)와 규칙 기반 정리(organize.ts)를 써요.
 */

/** 지금 로그인한 사람의 id. 일지는 쓴 사람 것만 내 기록에 보여요. */
const myId = () => getCurrentUser()?.id ?? SEED_OWNER_ID
const mine = (journal: MyJournal) => journal.ownerId === myId()

/** 배정 전에 쓴 일지가 담기는 분류 (명세: 배정 전 일지는 '미분류'로 저장) */
export const UNASSIGNED_PROJECT: MyProject = {
  id: 'unassigned',
  title: '미분류 (배정 전)',
  shortName: '미분류',
  cohort: MOCK_COHORT,
}

/** 이름을 찾을 수 있는 모든 프로젝트: 운영진이 만든 분류 + 지난 활동(목) */
function projectCatalog(): MyProject[] {
  const fromAdmin = store.projects.map(({ id, title, shortName, cohort }) => ({
    id,
    title,
    shortName,
    cohort,
  }))
  const known = new Set(fromAdmin.map((project) => project.id))
  return [
    ...fromAdmin,
    ...myProjects.filter((project) => !known.has(project.id)),
    UNASSIGNED_PROJECT,
  ]
}

/**
 * 내가 고를 수 있는 프로젝트. 지금 배정된 프로젝트가 맨 앞이고, 예전에 일지를 쓴 프로젝트가 뒤따라요.
 * 운영진은 운영 분류를, 배정 전 아기사자는 '미분류'를 골라요.
 */
export async function getMyProjects(): Promise<MyProject[]> {
  const user = getCurrentUser()
  const catalog = projectCatalog()
  const ids: string[] = []
  if (user?.userType === 'ADMIN') {
    ids.push(...store.projects.filter((p) => p.kind === 'OPS').map((p) => p.id))
  } else if (user?.project) {
    ids.push(user.project.id)
  }
  for (const journal of readJournals().filter(mine)) {
    if (journal.projectId) ids.push(journal.projectId)
  }
  if (ids.length === 0) ids.push(UNASSIGNED_PROJECT.id)
  return structuredClone(
    [...new Set(ids)]
      .map((id) => catalog.find((project) => project.id === id))
      .filter((project): project is MyProject => !!project),
  )
}
export async function getMyJournals(): Promise<MyJournal[]> {
  return readJournals().filter(mine)
}
export async function getMyJournal(id: string): Promise<MyJournal | null> {
  const journal = readJournal(id)
  return journal && mine(journal) ? journal : null
}

/** 빈 일지를 만들어요. 쓰기 화면이 바로 이 id로 자동 저장해요. */
export async function createJournalDraft(
  defaults: Pick<MyJournal, 'cohort' | 'projectId' | 'part'>,
): Promise<MyJournal> {
  const now = new Date()
  // 프로젝트를 안 정했으면 지금 배정된 프로젝트(없으면 미분류)로 시작해요.
  const projectId = defaults.projectId ?? (await getMyProjects())[0]?.id ?? null
  return writeJournal({
    id: `journal-${now.getTime().toString(36)}`,
    ownerId: myId(),
    ...defaults,
    projectId,
    eventType: null,
    phase: null,
    scope: 'NOW',
    body: { stuck: '', overcame: '', nextTime: '', memo: '' },
    importedMeetingIds: [],
    status: 'DRAFT',
    organized: null,
    createdAt: localDateString(now),
    updatedAt: now.toISOString(),
    readCount: 0,
    helpfulCount: 0,
  })
}

export async function saveJournal(journal: MyJournal): Promise<MyJournal> {
  return writeJournal(journal)
}

/** AI 정리 (목). 본문이 바뀌었으니 이전 정리본은 버리고 새로 만들어요. */
export async function organizeMyJournal(id: string): Promise<MyJournal> {
  const journal = readJournal(id)
  if (!journal) throw new Error('일지를 찾지 못했어요.')
  return writeJournal({ ...journal, organized: organizeJournal(journal) })
}

export async function answerFollowUp(id: string, answer: string): Promise<MyJournal> {
  const journal = readJournal(id)
  if (!journal) throw new Error('일지를 찾지 못했어요.')
  return writeJournal(appendFollowUp(journal, answer))
}

/** 검토 요청. 돌려받은 일지를 고쳐서 다시 내도 같은 id로 검토 대기가 돼요. */
export async function submitJournal(id: string): Promise<MyJournal> {
  const journal = readJournal(id)
  if (!journal?.organized) throw new Error('AI 정리를 먼저 해 주세요.')
  return writeJournal({
    ...journal,
    status: 'PENDING',
    submittedAt: localDateString(),
    decidedAt: undefined,
    rejectReason: undefined,
  })
}

export async function getPortfolioQuota() {
  return remainingToday()
}
export async function getPortfolioSummary(projectId: string, format: PortfolioFormat) {
  return readSummary(projectId, format)
}

/** 이력서 요약 (목). 하루 횟수를 하나 써요. */
export async function createPortfolioSummary(
  projectId: string,
  format: PortfolioFormat,
): Promise<PortfolioSummary> {
  const project = projectCatalog().find((item) => item.id === projectId)
  if (!project) throw new Error('프로젝트를 찾지 못했어요.')
  const journals = readJournals().filter(
    (journal) => mine(journal) && journal.projectId === projectId,
  )
  return createSummary(projectId, format, (variant) => ({
    projectId,
    format,
    ...summarizePortfolio(project, journals, format, variant),
    createdAt: new Date().toISOString(),
  }))
}
