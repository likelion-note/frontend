import { readJournal, readJournals, writeJournal } from '@/features/journal/journalStore'
import { myProjects } from '@/features/journal/mock/data'
import { appendFollowUp, organizeJournal, summarizePortfolio } from '@/features/journal/organize'
import { createSummary, readSummary, remainingToday } from '@/features/journal/portfolioStore'
import type { MyJournal, PortfolioFormat, PortfolioSummary } from '@/features/journal/types'
import { localDateString } from '@/features/meeting/meetingDates'

/**
 * 실제 API 엔드포인트가 정해지면 각 함수의 내부만 교체해요.
 * 지금은 브라우저 저장소(journalStore · portfolioStore)와 규칙 기반 정리(organize.ts)를 써요.
 */

export async function getMyProjects() {
  return structuredClone(myProjects)
}
export async function getMyJournals(): Promise<MyJournal[]> {
  return readJournals()
}
export async function getMyJournal(id: string): Promise<MyJournal | null> {
  return readJournal(id)
}

/** 빈 일지를 만들어요. 쓰기 화면이 바로 이 id로 자동 저장해요. */
export async function createJournalDraft(
  defaults: Pick<MyJournal, 'cohort' | 'projectId' | 'part'>,
): Promise<MyJournal> {
  const now = new Date()
  return writeJournal({
    id: `journal-${now.getTime().toString(36)}`,
    ...defaults,
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
  const project = myProjects.find((item) => item.id === projectId)
  if (!project) throw new Error('프로젝트를 찾지 못했어요.')
  const journals = readJournals().filter((journal) => journal.projectId === projectId)
  return createSummary(projectId, format, (variant) => ({
    projectId,
    format,
    ...summarizePortfolio(project, journals, format, variant),
    createdAt: new Date().toISOString(),
  }))
}
