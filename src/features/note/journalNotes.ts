import { EVENT_TYPE_LABEL } from '@/features/admin/types'
import { store } from '@/features/admin/mock/store'
import { readJournals, seedJournals } from '@/features/journal/journalStore'
import type { MyJournal } from '@/features/journal/types'
import type { Note } from '@/features/note/types'
import { getCurrentUser } from '@/lib/currentUser'

/**
 * 운영진이 승인한 성장일지를 노트로 바꿔요 (목). "승인하면 노트 게시판에 올라가요"를 실제로 이어 줘요.
 * 처음부터 공개돼 있던 예시 일지는 노트 목 데이터(mock/data.ts)에 이미 있어서, 이 브라우저에서
 * 새로 승인된 일지만 더해요. 백엔드가 붙으면 GET /api/notes 가 같은 규칙으로 걸러 줘요.
 *
 * 보이는 조건 (명세의 검토 · 공개 규칙)
 * - 내가 쓴 노트는 항상 보여요
 * - '지금 같은 기수에게' 공개한 노트만 같은 기수에게 보여요. 같은 프로젝트 팀원에게는 숨겨요
 * - '다음 기수부터' 공개한 노트는 지금 기수에게 보이지 않아요
 */
const seedStatus = new Map(seedJournals.map((journal) => [journal.id, journal.status]))

function visibleToMe(journal: MyJournal): boolean {
  const me = getCurrentUser()
  if (!me) return false
  if (journal.ownerId === me.id) return true
  if (journal.scope !== 'NOW' || journal.cohort !== me.cohort) return false
  const sameTeam = !!journal.projectId && me.project?.id === journal.projectId
  return !sameTeam
}

function toNote(journal: MyJournal): Note | null {
  const organized = journal.organized
  if (!organized) return null
  const owner = store.members.find((member) => member.id === journal.ownerId)
  return {
    id: journal.id,
    cohort: journal.cohort,
    part: owner?.type === 'ADMIN' ? 'STAFF' : (journal.part ?? 'PM'),
    event: journal.eventType ? EVENT_TYPE_LABEL[journal.eventType] : '기타',
    phase: journal.phase ?? 'early',
    title: organized.title,
    excerpt: organized.preview,
    tags: organized.tags,
    sections: {
      stuck: organized.body.stuck,
      solved: organized.body.overcame,
      retry: organized.body.nextTime,
    },
    readCount: journal.readCount,
    helpfulCount: journal.helpfulCount,
    createdAt: journal.decidedAt ?? journal.updatedAt.slice(0, 10),
  }
}

export function approvedJournalNotes(): Note[] {
  return readJournals()
    .filter(
      (journal) =>
        journal.status === 'APPROVED' &&
        seedStatus.get(journal.id) !== 'APPROVED' &&
        visibleToMe(journal),
    )
    .map(toNote)
    .filter((note): note is Note => note !== null)
}
