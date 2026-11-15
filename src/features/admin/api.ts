import { USE_MOCK } from '@/api/client'
import * as mock from '@/features/admin/api.mock'
import * as real from '@/features/admin/api.real'

/**
 * 운영진 API. 화면은 이 파일만 불러요.
 * - 목 모드(VITE_USE_MOCK 이 'false' 가 아님): api.mock.ts — 브라우저에 저장되는 목 데이터
 * - 실제 모드: api.real.ts — 백엔드 호출
 * 두 파일은 함수 이름과 돌려주는 모양이 같아요.
 */
const impl: typeof mock = USE_MOCK ? mock : real

export type { PendingSort } from '@/features/admin/api.mock'

/**
 * 서버에 아직 API 가 없어서 실제 모드에서는 쓸 수 없는 기능. 화면이 이 값을 보고 버튼을 숨겨요.
 * 목 모드에서는 전부 돼요.
 */
export const adminCapabilities = {
  /** 일정 지우기 */
  deleteEvent: USE_MOCK,
}

export const getMe = impl.getMe
export const getReviewSummary = impl.getReviewSummary
export const listPendingJournals = impl.listPendingJournals
export const listRecentDecisions = impl.listRecentDecisions
export const getJournal = impl.getJournal
export const approveJournal = impl.approveJournal
export const rejectJournal = impl.rejectJournal
export const listMembers = impl.listMembers
export const listProjects = impl.listProjects
export const assignMember = impl.assignMember
export const unassignMember = impl.unassignMember
export const createProject = impl.createProject
export const deleteProject = impl.deleteProject
export const listEvents = impl.listEvents
export const createEvent = impl.createEvent
export const deleteEvent = impl.deleteEvent
