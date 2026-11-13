import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { initialMeetingDraft, meetingDefinitions } from '@/features/meeting/mock/data'
import type { MeetingDraft, MeetingType } from '@/features/meeting/types'
const storageKey = 'likelion-meeting-draft:v1'
const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d$/
function loadDraft(): MeetingDraft {
  const fallback = structuredClone(initialMeetingDraft)
  try {
    const value = JSON.parse(sessionStorage.getItem(storageKey) ?? 'null') as unknown
    if (!value || typeof value !== 'object') return fallback
    const saved = value as Partial<MeetingDraft>
    if (meetingDefinitions.some((meeting) => meeting.id === saved.type)) fallback.type = saved.type!
    if (typeof saved.time === 'string' && timePattern.test(saved.time)) fallback.time = saved.time
    for (const meeting of meetingDefinitions) {
      const ids = saved.completed?.[meeting.id]
      if (Array.isArray(ids))
        fallback.completed[meeting.id] = meeting.questions
          .filter((question) => ids.includes(question.id))
          .map((question) => question.id)
    }
  } catch {
    /* 저장소가 차단되거나 값이 손상되면 기본 상태를 사용해요. */
  }
  return fallback
}
export function useMeeting() {
  const [params, setParams] = useSearchParams()
  const preset = meetingDefinitions.find((meeting) => meeting.id === params.get('meetingType'))?.id
  const [draft, setDraft] = useState(() => ({
    ...loadDraft(),
    ...(preset ? { type: preset } : {}),
  }))
  useEffect(() => {
    if (!preset) return
    setDraft((current) => ({ ...current, type: preset }))
    setParams(
      (current) => {
        const next = new URLSearchParams(current)
        next.delete('meetingType')
        return next
      },
      { replace: true },
    )
  }, [preset, setParams])
  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(draft))
    } catch {
      /* 저장소 없이도 현재 화면은 동작해요. */
    }
  }, [draft])
  const definition = meetingDefinitions.find((meeting) => meeting.id === draft.type)!
  function selectType(type: MeetingType) {
    setDraft((current) => ({ ...current, type }))
  }
  function setTime(time: string) {
    if (timePattern.test(time)) setDraft((current) => ({ ...current, time }))
  }
  function toggleQuestion(id: string) {
    setDraft((current) => {
      const ids = current.completed[current.type]
      return {
        ...current,
        completed: {
          ...current.completed,
          [current.type]: ids.includes(id)
            ? ids.filter((questionId) => questionId !== id)
            : [...ids, id],
        },
      }
    })
  }
  function moveType(direction: number) {
    setDraft((current) => {
      const index = meetingDefinitions.findIndex((meeting) => meeting.id === current.type)
      return {
        ...current,
        type: meetingDefinitions[
          Math.max(0, Math.min(meetingDefinitions.length - 1, index + direction))
        ].id,
      }
    })
  }
  return { draft, definition, selectType, setTime, toggleQuestion, moveType }
}
