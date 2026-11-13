import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router'

import grid from '@/assets/journal/grid-bg.svg'
import { BackHeader, ScreenContent } from '@/components/layout/Screen'
import { Button } from '@/components/ui/Button'
import { saveJournal } from '@/features/journal/api'
import { ChoiceChips } from '@/features/journal/components/ChoiceChips'
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
} from '@/features/journal/labels'
import { importMeetings, meetingsLabel, thisWeekMeetings } from '@/features/journal/meetingImport'
import type { MyJournal } from '@/features/journal/types'
import { useJournalCache, useMyJournal, useMyProjects } from '@/features/journal/useJournals'
import { useMeetingRecords } from '@/features/meeting/useMeetingRecords'

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

/** AI 정리 전에 꼭 있어야 하는 칸. 선택 칸(다시 한다면 · 자유 메모)은 비어도 돼요. */
function validate(journal: MyJournal) {
  const errors: Partial<Record<Field, string>> = {}
  if (!journal.projectId) errors.project = '프로젝트를 골라 주세요.'
  if (!journal.eventType) errors.event = '어떤 활동이었는지 골라 주세요.'
  if (!journal.phase) errors.phase = '그때가 언제였는지 골라 주세요.'
  if (!journal.part) errors.part = '이때 내 파트를 골라 주세요.'
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

  // 처음 불러온 값으로 한 번만 채우고, 그 뒤로는 화면 상태가 기준이에요.
  if (query.data && draft?.id !== query.data.id) setDraft(query.data)

  const weekly = meetings.data ? thisWeekMeetings(meetings.data) : []
  const allImported =
    weekly.length > 0 && weekly.every((record) => draft?.importedMeetingIds.includes(record.id))

  function update(next: MyJournal) {
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
      <div className="bg-paper shrink-0">
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
      <ScreenContent
        className="bg-paper gap-4 [background-size:390px_auto] [background-position:top_center] [background-repeat:repeat-y] pt-2 pb-[max(28px,env(safe-area-inset-bottom))]"
        style={{ backgroundImage: `url(${grid})` }}
      >
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
          <div className="border-input-line focus-within:border-accent relative flex h-[50px] items-center border-b-[1.4px] px-0.5">
            <select
              id="journal-project"
              value={draft.projectId ?? ''}
              aria-invalid={!!errors.project}
              aria-describedby={describe('project')}
              onChange={(event) => update({ ...draft, projectId: event.target.value || null })}
              className="text-ink min-w-0 flex-1 appearance-none bg-transparent pr-6 text-[14px] leading-[20px] outline-none"
            >
              <option value="" disabled>
                프로젝트를 골라 주세요
              </option>
              {(projects.data ?? []).map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
            <span
              aria-hidden="true"
              className="text-muted pointer-events-none absolute right-0.5 text-[13px] font-bold"
            >
              ▾
            </span>
          </div>
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
            partLabel={draft.part ? partLabel(draft.part) : null}
          />
        </section>
        <p className="text-muted text-[12px] leading-[17px]">
          어느 쪽이든 이름은 나오지 않고, 운영진이 이름 없이 검토한 뒤 올라가요
        </p>
        <Button onClick={organize} className="leading-[22px]">
          AI로 정리하기
        </Button>
      </ScreenContent>
    </div>
  )
}
