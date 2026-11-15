/**
 * 백엔드 값 ↔ 화면 값 변환. 백엔드는 전부 대문자 코드(W1_2, ROLE_SPLIT …)와 숫자 id 를 쓰고,
 * 화면은 목 데이터 때 정한 값('soon', '#역할 분담', 문자열 id)을 써요. 실제 모드의 api 함수만 이 파일을 써요.
 */
import { PART_LABEL, type Part } from '@/features/admin/types'

/** 숫자 id → 화면의 문자열 id */
export const toId = (id: number | string) => String(id)
/** 화면의 문자열 id → 숫자 id. 숫자가 아니면 null (예: '미분류') */
export function fromId(id: string | null | undefined): number | null {
  if (id === null || id === undefined || !/^\d+$/.test(id)) return null
  return Number(id)
}

/* ---------- 시점 ---------- */

export type ApiTiming = 'W2PLUS' | 'W1_2' | 'DURING' | 'AFTER'
export type Phase = 'early' | 'soon' | 'event-week' | 'after'

const PHASE_OF: Record<ApiTiming, Phase> = {
  W2PLUS: 'early',
  W1_2: 'soon',
  DURING: 'event-week',
  AFTER: 'after',
}
export const toPhase = (timing: ApiTiming | null | undefined): Phase | null =>
  timing ? (PHASE_OF[timing] ?? null) : null
export const fromPhase = (phase: Phase | null | undefined): ApiTiming | null =>
  phase
    ? ((Object.keys(PHASE_OF) as ApiTiming[]).find((key) => PHASE_OF[key] === phase) ?? null)
    : null

/* ---------- 상황 태그 (12개) ---------- */

export const TAG_LABEL = {
  MEETING_RUN: '회의 진행',
  CONFLICT: '의견 충돌',
  TOPIC_PICK: '주제 선정',
  TOPIC_CHANGE: '주제 변경',
  DELAY: '일정 지연',
  PLAN_DOC: '기획서 작성',
  PLAN_DEV: '기획↔개발 전달',
  DESIGN_COLLAB: '디자인 협업',
  STACK: '기술 스택 선택',
  RELEASE: '발표·배포 준비',
  ROLE_SPLIT: '역할 분담',
  PARTICIPATION: '팀원 참여도',
} as const
export type ApiTag = keyof typeof TAG_LABEL

/** 'ROLE_SPLIT' → '#역할 분담' (노트 · 성장일지 화면의 태그 표기) */
export const toHashTag = (code: string) => `#${TAG_LABEL[code as ApiTag] ?? code}`
/** '#역할 분담' 또는 '역할 분담' → 'ROLE_SPLIT'. 모르는 태그는 null */
export function fromTagLabel(label: string): ApiTag | null {
  const plain = label.replace(/^#/, '').replace(/\s+/g, '')
  return (
    (Object.keys(TAG_LABEL) as ApiTag[]).find(
      (code) => TAG_LABEL[code].replace(/\s+/g, '') === plain,
    ) ?? null
  )
}
/** 노트 게시판 '상황' 필터에 보여줄 태그 */
export const ALL_HASH_TAGS = (Object.keys(TAG_LABEL) as ApiTag[]).map(toHashTag)

/* ---------- 작성자 표기 · 가린 이름 ---------- */

const PART_CODES = Object.keys(PART_LABEL) as Part[]

/**
 * 서버의 작성자 표기는 파트가 코드로 와요 ('14기 · BACKEND'). 화면 이름으로 바꿔요 ('14기 · 백엔드').
 */
export function authorLabelText(label: string | null | undefined): string {
  if (!label) return ''
  return label
    .split(' · ')
    .map((piece) => (PART_CODES.includes(piece as Part) ? PART_LABEL[piece as Part] : piece))
    .join(' · ')
}
/** 작성자 표기에서 파트를 꺼내요. '14기 운영진'은 OPS */
export function partOfAuthorLabel(label: string | null | undefined): Part | null {
  if (!label) return null
  if (label.includes('운영진')) return 'OPS'
  return PART_CODES.find((code) => label.split(' · ').includes(code)) ?? null
}
/** '지난 기수 B팀 · PM' → 'B팀' */
export const teamOfAuthorLabel = (label: string | null | undefined) =>
  label?.match(/지난 기수 (\S+팀)/)?.[1]

/** AI 가 가린 이름은 ⟦팀원⟧ 처럼 와요. 화면에서는 [팀원] 으로 보여줘요 */
export const unmask = (text: string | null | undefined) =>
  (text ?? '').replace(/⟦/g, '[').replace(/⟧/g, ']')
/** 가린 이름이 몇 곳인지 */
export const maskedCount = (...texts: (string | null | undefined)[]) =>
  texts.reduce((sum, text) => sum + (text?.match(/⟦[^⟧]*⟧/g)?.length ?? 0), 0)

/** '2026-11-12T17:40:00' → '2026-11-12' */
export const dateOnly = (value: string | null | undefined) => (value ?? '').slice(0, 10)
