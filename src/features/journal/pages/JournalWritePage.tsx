import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router'

import { BackHeader, ScreenContent } from '@/components/layout/Screen'
import { Dropdown } from '@/components/ui/Dropdown'
import { Button } from '@/components/ui/Button'
import { deleteJournal, saveJournal } from '@/features/journal/api'
import { ChoiceChips } from '@/features/journal/components/ChoiceChips'
import { DeleteJournalButton } from '@/features/journal/components/DeleteJournalButton'
import { JournalIllustration } from '@/features/journal/components/JournalIllustration'
import { MeetingImportBanner } from '@/features/journal/components/MeetingImportBanner'
import { RuledTextarea } from '@/features/journal/components/RuledTextarea'
import { ScopeOptions } from '@/features/journal/components/ScopeOptions'
import {
  eventLabel,
  journalEventTypes,
  journalParts,
  journalPhases,
  partLabel,
  pastTeamLabel,
} from '@/features/journal/labels'
import { importMeetings, meetingsLabel, thisWeekMeetings } from '@/features/journal/meetingImport'
import type { MyJournal } from '@/features/journal/types'
import { useJournalCache, useMyJournal, useMyProjects } from '@/features/journal/useJournals'
import { useMeetingRecords } from '@/features/meeting/useMeetingRecords'
import { isAdmin } from '@/lib/currentUser'

type Field = 'project' | 'event' | 'phase' | 'part' | 'stuck' | 'overcame'
/** 오류가 난 첫 칸으로 스크롤 · 포커스할 때 쓰는 요소 id (위에서 아래 순서) */
const fieldIds: Record<Field, string> = {
  project: 'journal-project',
  event: 'journal-event-field',
  phase: 'journal-phase-field',
  part: 'journal-part-field',
  stuck: 'journal-stuck',
  overcame: 'journal-overcame',
}
const fieldOrder = Object.keys(fieldIds) as Field[]

/**
 * AI 정리 전에 꼭 있어야 하는 칸. 선택 칸(다시 한다면 · 자유 메모)은 비어도 돼요.
 * 운영진은 파트가 '운영진' 하나라서 파트 칸을 묻지 않아요.
 */
function validate(journal: MyJournal, staff = isAdmin()) {
  const errors: Partial<Record<Field, string>> = {}
  if (!journal.projectId) errors.project = '프로젝트를 골라 주세요.'
  if (!journal.eventType) errors.event = '어떤 활동이었는지 골라 주세요.'
  if (!journal.phase) errors.phase = '그때가 언제였는지 골라 주세요.'
  if (!journal.part && !staff) errors.part = '이때 내 파트를 골라 주세요.'
  if (!journal.body.stuck.trim()) errors.stuck = '막힌 것을 한 줄이라도 적어 주세요.'
  if (!journal.body.overcame.trim()) errors.overcame = '어떻게 넘겼는지 적어 주세요.'
  return errors
}

/**
 * 성장일지 쓰기 (SCR-JOUR-01). 고칠 때마다 바로 저장해서 헤더에 '자동 저장됨'을 보여줘요.
 * 돌려받은 일지도 이 화면에서 고쳐요. 검토 중이거나 공개된 일지는 상세로 돌려보내요.
 */
export function JournalWritePage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const query = useMyJournal(id)
  const projects = useMyProjects()
  const meetings = useMeetingRecords()
  const cache = useJournalCache()
  const [draft, setDraft] = useState<MyJournal | null>(null)
  const [saveState, setSaveState] = useState<'saved' | 'failed'>('saved')
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const staff = isAdmin()

  // 처음 불러온 값으로 한 번만 채우고, 그 뒤로는 화면 상태가 기준이에요.
  if (query.data && draft?.id !== query.data.id) setDraft(query.data)

  /**
   * 열기만 하고 아무것도 안 쓴 채 나가면 그 일지를 지워요. 빈 일지가 서버에 남으면
   * 그 프로젝트 분류를 지울 수 없게 돼요. 이 화면에서 한 번이라도 고쳤으면(touched) 남겨요.
   */
  const touched = useRef(false)
  const latest = useRef({ draft, cache })
  useEffect(() => {
    latest.current = { draft, cache }
  })
  useEffect(() => {
    const mountedAt = Date.now()
    return () => {
      const { draft: journal, cache: journalCache } = latest.current
      // 개발 모드는 화면을 한 번 붙였다 떼어 보는데, 그때는 지우지 않아요
      if (!journal || touched.current || Date.now() - mountedAt < 400) return
      const blank =
        journal.status === 'DRAFT' &&
        !journal.organized &&
        !journal.eventType &&
        journal.importedMeetingIds.length === 0 &&
        Object.values(journal.body).every((text) => !text.trim())
      if (!blank) return
      deleteJournal(journal.id)
        .then(() => journalCache.remove(journal.id))
        .catch(() => undefined)
    }
  }, [])

  const weekly = meetings.data ? thisWeekMeetings(meetings.data) : []
  const allImported =
    weekly.length > 0 && weekly.every((record) => draft?.importedMeetingIds.includes(record.id))

  function update(next: MyJournal) {
    touched.current = true
    setDraft(next)
    setErrors((current) => (Object.keys(current).length ? validate(next) : current))
    saveJournal(next)
      .then((saved) => {
        cache.put(saved)
        setSaveState('saved')
      })
      .catch(() => setSaveState('failed'))
  }
  const body = (patch: Partial<MyJournal['body']>) =>
    draft && update({ ...draft, body: { ...draft.body, ...patch } })

  // 내 기록 · 홈 · 회의 정리에서 '불러와서 쓰기'로 들어오면 한 번만 채워요.
  const importOnce = params.get('import') === 'week'
  useEffect(() => {
    if (!importOnce || !draft || !meetings.data) return
    const records = thisWeekMeetings(meetings.data)
    if (records.length) update(importMeetings(draft, records))
    const next = new URLSearchParams(params)
    next.delete('import')
    setParams(next, { replace: true })
    // 들어온 직후 한 번만 실행해요.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importOnce, draft?.id, meetings.data])

  if (query.isPending || (query.data && !draft)) {
    return (
      <ScreenContent>
        <p role="status" className="text-muted text-[13px]">
          일지를 펼치고 있어요.
        </p>
      </ScreenContent>
    )
  }
  if (query.isError || !query.data || !draft) {
    return (
      <ScreenContent>
        <div role="alert" className="text-[13px]">
          <p>일지를 찾지 못했어요. 지워졌거나 주소가 바뀌었을 수 있어요.</p>
          <Link to="/me" className="text-accent-deep mt-2 inline-block underline">
            내 기록으로
          </Link>
        </div>
      </ScreenContent>
    )
  }
  if (draft.status === 'PENDING' || draft.status === 'APPROVED') {
    return <Navigate to={`/me/journal/${draft.id}`} replace />
  }

  function organize() {
    if (!draft) return
    const found = validate(draft)
    setErrors(found)
    const first = fieldOrder.find((field) => found[field])
    if (first) {
      const node = document.getElementById(fieldIds[first])
      node?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      node?.focus({ preventScroll: true })
      return
    }
    navigate(`/me/journal/${draft.id}/organizing`)
  }

  const error = (field: Field) =>
    errors[field] && (
      <p id={`${field}-error`} className="text-danger text-[12px] leading-[16px]">
        {errors[field]}
      </p>
    )
  const describe = (field: Field) => (errors[field] ? `${field}-error` : undefined)
  const label = 'text-[14px] leading-[20px] font-bold'

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0">
        <BackHeader
          title="성장일지 쓰기"
          backTo="/me"
          right={
            <span role="status" className={saveState === 'failed' ? 'text-danger' : undefined}>
              {saveState === 'saved' ? '자동 저장됨' : '저장하지 못했어요'}
            </span>
          }
        />
      </div>
      <ScreenContent className="gap-4 pt-2 pb-[max(28px,env(safe-area-inset-bottom))]">
        {draft.status === 'REJECTED' && draft.rejectReason && (
          <div className="bg-rose-2 flex flex-col gap-1 rounded-2xl px-4 py-3">
            <p className="text-danger text-[12px] leading-[17px] font-bold">운영진이 남긴 한 줄</p>
            <p className="text-[14px] leading-[20px] font-medium">“{draft.rejectReason}”</p>
          </div>
        )}
        {weekly.length > 0 && (
          <MeetingImportBanner
            title={`이번 주 회의 ${weekly.length}개 불러오기`}
            description={meetingsLabel(weekly)}
            onImport={() => update(importMeetings(draft, weekly))}
            imported={allImported}
          />
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="journal-project" className={label}>
            프로젝트
          </label>
          <Dropdown
            id="journal-project"
            value={draft.projectId}
            options={(projects.data ?? []).map((project) => ({
              value: project.id,
              label: project.title,
            }))}
            onChange={(projectId) => update({ ...draft, projectId })}
            placeholder="프로젝트를 골라 주세요"
            invalid={!!errors.project}
            describedBy={describe('project')}
          />
          {error('project')}
        </div>
        <p className="text-muted text-[12px] leading-[17px]">
          운영진이 배정한 프로젝트예요. 포트폴리오도 이 분류로 묶여요
        </p>

        <section className="flex flex-col gap-2 pt-1">
          <h2 id="journal-event" className={label}>
            어떤 활동이었나요
          </h2>
          <div id="journal-event-field" tabIndex={-1} className="outline-none">
            <ChoiceChips
              id="journal-event"
              options={journalEventTypes.map((type) => ({ value: type, label: eventLabel(type) }))}
              value={draft.eventType}
              onChange={(eventType) => update({ ...draft, eventType })}
              invalid={!!errors.event}
            />
          </div>
          {error('event')}
        </section>

        <section className="flex flex-col gap-2 pt-1">
          <h2 id="journal-phase" className={label}>
            그때가 언제였나요
          </h2>
          <div id="journal-phase-field" tabIndex={-1} className="outline-none">
            <ChoiceChips
              id="journal-phase"
              options={journalPhases.map(({ id: value, label: text }) => ({ value, label: text }))}
              value={draft.phase}
              onChange={(phase) => update({ ...draft, phase })}
              invalid={!!errors.phase}
            />
          </div>
          {error('phase')}
        </section>

        {/* 운영진 글은 '14기 운영진'으로 올라가서 파트를 고르지 않아요 */}
        {!staff && (
          <section className="flex flex-col gap-2 pt-1">
            <h2 id="journal-part" className={label}>
              이때 내 파트
            </h2>
            <div id="journal-part-field" tabIndex={-1} className="outline-none">
              <ChoiceChips
                id="journal-part"
                options={journalParts.map((part) => ({ value: part, label: partLabel(part) }))}
                value={draft.part}
                onChange={(part) => update({ ...draft, part })}
                invalid={!!errors.part}
              />
            </div>
            {error('part')}
          </section>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="journal-stuck" className={`${label} flex items-center gap-2`}>
            <JournalIllustration name="eraser" size={22} />
            이번에 막힌 것
          </label>
          <RuledTextarea
            id="journal-stuck"
            minHeight={110}
            value={draft.body.stuck}
            onChange={(event) => body({ stuck: event.target.value })}
            placeholder="무엇이 어떻게 막혔는지, 그때 기분까지 괜찮아요"
            aria-invalid={!!errors.stuck}
            aria-describedby={describe('stuck')}
          />
          {error('stuck')}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="journal-overcame" className={`${label} flex items-center gap-2`}>
            <JournalIllustration name="pencil" size={22} />
            어떻게 넘겼나
          </label>
          <RuledTextarea
            id="journal-overcame"
            minHeight={110}
            value={draft.body.overcame}
            onChange={(event) => body({ overcame: event.target.value })}
            placeholder="실제로 한 행동을 적어주세요"
            aria-invalid={!!errors.overcame}
            aria-describedby={describe('overcame')}
          />
          {error('overcame')}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="journal-next" className={label}>
            다시 한다면 (선택)
          </label>
          <RuledTextarea
            id="journal-next"
            minHeight={80}
            value={draft.body.nextTime}
            onChange={(event) => body({ nextTime: event.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="journal-memo" className={label}>
            자유 메모 (선택)
          </label>
          <RuledTextarea
            id="journal-memo"
            minHeight={80}
            value={draft.body.memo}
            onChange={(event) => body({ memo: event.target.value })}
            aria-describedby="journal-memo-hint"
          />
          <p id="journal-memo-hint" className="sr-only">
            자유 메모는 나만 보고 정리본에는 들어가지 않아요.
          </p>
        </div>

        <section className="flex flex-col gap-3.5 pt-1">
          <h2 id="journal-scope" className={`${label} flex items-center gap-1.5`}>
            <JournalIllustration name="flag" size={22} />
            누구에게 공개할까요
          </h2>
          <ScopeOptions
            id="journal-scope"
            value={draft.scope}
            onChange={(scope) => update({ ...draft, scope })}
            cohort={draft.cohort}
            partLabel={staff ? '운영진' : draft.part ? partLabel(draft.part) : null}
            pastLabel={pastTeamLabel(draft.projectId)}
          />
        </section>
        <p className="text-muted text-[12px] leading-[17px]">
          어느 쪽이든 이름은 나오지 않고, 운영진이 이름 없이 검토한 뒤 올라가요
        </p>
        <Button onClick={organize} className="leading-[22px]">
          AI로 정리하기
        </Button>
        <DeleteJournalButton
          journal={draft}
          onBeforeDelete={() => {
            touched.current = true
          }}
        />
      </ScreenContent>
    </div>
  )
}
