import { USE_MOCK } from '@/api/client'
import * as mock from '@/features/journal/api.mock'
import * as real from '@/features/journal/api.real'

/**
 * 성장일지 · 포트폴리오 API. 화면은 이 파일만 불러요.
 * - 목 모드: api.mock.ts — 브라우저 저장소(journalStore · portfolioStore)와 규칙 기반 정리
 * - 실제 모드: api.real.ts — 백엔드 호출 (/api/journals, /api/portfolio)
 * 두 파일은 함수 이름과 돌려주는 모양이 같아요.
 */
const impl: typeof mock = USE_MOCK ? mock : real

export const UNASSIGNED_PROJECT = impl.UNASSIGNED_PROJECT
export const getMyProjects = impl.getMyProjects
export const getMyJournals = impl.getMyJournals
export const getMyJournal = impl.getMyJournal
export const createJournalDraft = impl.createJournalDraft
export const saveJournal = impl.saveJournal
export const organizeMyJournal = impl.organizeMyJournal
export const answerFollowUp = impl.answerFollowUp
export const submitJournal = impl.submitJournal
export const getPortfolioQuota = impl.getPortfolioQuota
export const getPortfolioSummary = impl.getPortfolioSummary
export const createPortfolioSummary = impl.createPortfolioSummary
