import { myJournals } from '@/features/journal/mock/data'
import { otherJournals } from '@/features/journal/mock/others'
import { now } from '@/lib/clock'
import { SEED_USER_ID } from '@/lib/currentUser'
import type { MyJournal } from '@/features/journal/types'

/**
 * 내 일지 저장소. 목 데이터 + localStorage의 일지를 id로 합쳐요 (회의 기록 recordStore와 같은 방식).
 * 백엔드가 붙으면 api.ts에서 이 파일 대신 서버를 불러요.
 */
export const journalsStorageKey = 'likelion-journals:v1'

const object = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object'
const text = (value: unknown) => typeof value === 'string'

function validJournal(value: unknown): value is MyJournal {
  return (
    object(value) &&
    text(value.id) &&
    typeof value.cohort === 'number' &&
    object(value.body) &&
    text(value.body.stuck) &&
    text(value.body.overcame) &&
    text(value.body.nextTime) &&
    text(value.body.memo) &&
    (value.scope === 'NOW' || value.scope === 'NEXT') &&
    ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED'].includes(value.status as string) &&
    Array.isArray(value.importedMeetingIds) &&
    text(value.createdAt) &&
    text(value.updatedAt)
  )
}

function savedJournals(): MyJournal[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(journalsStorageKey) ?? '[]')
    return Array.isArray(value) ? value.filter(validJournal) : []
  } catch {
    return []
  }
}

/** 피그마 예시 일지 5개는 목 계정 '데옹'의 일지예요. */
export const SEED_OWNER_ID = SEED_USER_ID

/** 처음부터 들어 있는 일지: 데옹의 일지 + 다른 멤버가 낸 일지(운영진 검토용) */
export const seedJournals: MyJournal[] = [
  ...myJournals.map((journal) => ({ ...journal, ownerId: SEED_OWNER_ID })),
  ...otherJournals,
]

/** 모든 사람의 일지. 최근에 쓴 일지가 위로 와요. 내 것만 볼 때는 api.ts의 getMyJournals를 써요. */
export function readJournals(): MyJournal[] {
  const byId = new Map(seedJournals.map((journal) => [journal.id, journal]))
  for (const journal of savedJournals()) {
    byId.set(journal.id, { ...journal, ownerId: journal.ownerId ?? SEED_OWNER_ID })
  }
  return structuredClone([...byId.values()]).sort(
    (left, right) =>
      (right.submittedAt ?? right.updatedAt).localeCompare(left.submittedAt ?? left.updatedAt) ||
      right.updatedAt.localeCompare(left.updatedAt),
  )
}

export function readJournal(id: string) {
  return readJournals().find((journal) => journal.id === id) ?? null
}

/** id 기준으로 덮어써요. 저장에 실패하면 화면이 안내할 수 있게 오류를 던져요. */
export function writeJournal(journal: MyJournal): MyJournal {
  const next = { ...journal, updatedAt: now().toISOString() }
  const saved = savedJournals().filter((item) => item.id !== next.id)
  try {
    localStorage.setItem(journalsStorageKey, JSON.stringify([...saved, next]))
  } catch {
    throw new Error('일지를 저장하지 못했어요. 저장 공간과 브라우저 권한을 확인해 주세요.')
  }
  return structuredClone(next)
}
