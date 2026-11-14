import { localDateString } from '@/features/meeting/meetingDates'
import { userStorageKey } from '@/lib/currentUser'
import { dailyPortfolioLimit } from '@/features/journal/mock/data'
import type { PortfolioFormat, PortfolioSummary } from '@/features/journal/types'

/**
 * 포트폴리오 요약과 오늘 만든 횟수를 브라우저에 보관해요.
 * 횟수 제한은 실제로는 서버가 정해요. 날짜가 바뀌면 다시 5번이에요.
 */
/** 요약과 하루 횟수는 계정마다 따로 보관해요. */
const storageKey = () => userStorageKey('likelion-portfolio:v1')

type State = {
  date: string
  used: number
  /** 만든 횟수(다시 만들기 순서)도 프로젝트 · 형식별로 기억해요. */
  summaries: Record<string, PortfolioSummary & { variant: number }>
}

export const summaryKey = (projectId: string, format: PortfolioFormat) => `${projectId}:${format}`

function read(): State {
  const today = localDateString()
  try {
    const value = JSON.parse(localStorage.getItem(storageKey()) ?? 'null') as State | null
    if (value && typeof value === 'object' && value.summaries) {
      return value.date === today ? value : { ...value, date: today, used: 0 }
    }
  } catch {
    /* 처음 상태로 시작해요. */
  }
  return { date: today, used: 0, summaries: {} }
}

function write(state: State) {
  try {
    localStorage.setItem(storageKey(), JSON.stringify(state))
  } catch {
    throw new Error('요약을 저장하지 못했어요. 저장 공간과 브라우저 권한을 확인해 주세요.')
  }
}

export const remainingToday = () => Math.max(0, dailyPortfolioLimit - read().used)

export function readSummary(projectId: string, format: PortfolioFormat) {
  return read().summaries[summaryKey(projectId, format)] ?? null
}

/**
 * 요약을 새로 만들어 저장해요. 같은 프로젝트 · 형식을 다시 만들면 variant가 1씩 올라가요.
 * 남은 횟수가 없으면 오류를 던지고, 성공하면 횟수를 하나 써요.
 */
export function createSummary(
  projectId: string,
  format: PortfolioFormat,
  build: (variant: number) => PortfolioSummary,
) {
  const state = read()
  if (state.used >= dailyPortfolioLimit) {
    throw new Error('오늘은 요약을 더 만들 수 없어요. 내일 다시 만들어 주세요.')
  }
  const key = summaryKey(projectId, format)
  const previous = state.summaries[key]?.variant
  const variant = previous === undefined ? 0 : previous + 1
  const next = { ...build(variant), variant }
  write({ ...state, used: state.used + 1, summaries: { ...state.summaries, [key]: next } })
  return next
}
