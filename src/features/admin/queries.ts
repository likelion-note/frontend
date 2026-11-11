import { queryOptions } from '@tanstack/react-query'

import * as api from '@/features/admin/api'

/** 운영진 화면이 쓰는 쿼리 키·옵션 모음 */
export const adminKeys = {
  all: ['admin'] as const,
  me: () => [...adminKeys.all, 'me'] as const,
  summary: () => [...adminKeys.all, 'summary'] as const,
  pending: (sort: api.PendingSort) => [...adminKeys.all, 'journals', 'pending', sort] as const,
  recent: () => [...adminKeys.all, 'journals', 'recent'] as const,
  journal: (id: string) => [...adminKeys.all, 'journals', id] as const,
  members: () => [...adminKeys.all, 'members'] as const,
  projects: () => [...adminKeys.all, 'projects'] as const,
  events: () => [...adminKeys.all, 'events'] as const,
  inviteCodes: () => [...adminKeys.all, 'invite-codes'] as const,
}

export const meQuery = () => queryOptions({ queryKey: adminKeys.me(), queryFn: api.getMe })

export const summaryQuery = () =>
  queryOptions({ queryKey: adminKeys.summary(), queryFn: api.getReviewSummary })

export const pendingJournalsQuery = (sort: api.PendingSort) =>
  queryOptions({ queryKey: adminKeys.pending(sort), queryFn: () => api.listPendingJournals(sort) })

export const recentDecisionsQuery = () =>
  queryOptions({ queryKey: adminKeys.recent(), queryFn: () => api.listRecentDecisions() })

export const journalQuery = (id: string) =>
  queryOptions({ queryKey: adminKeys.journal(id), queryFn: () => api.getJournal(id) })

export const membersQuery = () =>
  queryOptions({ queryKey: adminKeys.members(), queryFn: api.listMembers })

export const projectsQuery = () =>
  queryOptions({ queryKey: adminKeys.projects(), queryFn: api.listProjects })

export const eventsQuery = () =>
  queryOptions({ queryKey: adminKeys.events(), queryFn: api.listEvents })

export const inviteCodesQuery = () =>
  queryOptions({ queryKey: adminKeys.inviteCodes(), queryFn: api.listInviteCodes })
