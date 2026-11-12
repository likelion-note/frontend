import { useQueryClient } from '@tanstack/react-query'
import { useRef, useState, type FormEvent } from 'react'

import lines from '@/assets/meeting/summary-lines.svg'
import { ScreenContent } from '@/components/layout/Screen'
import { Button } from '@/components/ui/Button'
import { getMeetingRecords, saveMeetingSummary } from '@/features/meeting/api'
import { AutoGrowTextarea } from '@/features/meeting/components/AutoGrowTextarea'
import { MeetingIllustration } from '@/features/meeting/components/MeetingIllustration'
import { SummaryActionRow } from '@/features/meeting/components/SummaryActionRow'
import { persistSummaryDraft } from '@/features/meeting/recordStore'
import { newActionItem, validateSummary, type SummaryErrors } from '@/features/meeting/summaryDraft'
import type { MeetingRecord, MeetingSummaryDraft } from '@/features/meeting/types'

export function MeetingSummaryForm({
  initialDraft,
  background,
  onSaved,
}: {
  initialDraft: MeetingSummaryDraft
  background: string
  onSaved: (record: MeetingRecord) => void
}) {
  const [draft, setDraft] = useState(() => structuredClone(initialDraft))
  const [errors, setErrors] = useState<SummaryErrors>({})
  const [saveError, setSaveError] = useState('')
  const [draftWarning, setDraftWarning] = useState('')
  const [saving, setSaving] = useState(false)
  const savingRef = useRef(false)
  const queryClient = useQueryClient()

  function update(next: MeetingSummaryDraft) {
    setDraft(next)
    setErrors({})
    setSaveError('')
    queryClient.setQueryData(['meeting', 'summary-draft', next.id], next)
    try {
      persistSummaryDraft(next)
      setDraftWarning('')
    } catch (error) {
      setDraftWarning(error instanceof Error ? error.message : '임시 저장에 실패했어요.')
    }
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (savingRef.current) return
    const found = validateSummary(draft)
    setErrors(found)
    if (Object.keys(found).length) {
      const form = event.currentTarget
      requestAnimationFrame(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    savingRef.current = true
    setSaving(true)
    setSaveError('')
    try {
      const record = await saveMeetingSummary(draft)
      queryClient.setQueryData(['meeting', 'record', record.id], record)
      queryClient.setQueryData(['meeting', 'records'], await getMeetingRecords())
      onSaved(record)
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : '회의 기록을 저장하지 못했어요.')
    } finally {
      savingRef.current = false
      setSaving(false)
    }
  }

  return (
    <form
      noValidate
      onSubmit={(event) => void save(event)}
      className="flex min-h-0 flex-1 flex-col"
    >
      <ScreenContent
        className="bg-paper [background-size:390px_auto] [background-position:top_center] [background-repeat:repeat-y] pt-2 pb-[max(28px,env(safe-area-inset-bottom))]"
        style={{ backgroundImage: `url(${background})` }}
      >
        <p className="text-ink-2 text-[13px] leading-[16px]">
          팀원과 같이 봐야 할 것만 적어요. 느낀 점과 시행착오는 성장일지에 따로 남겨요.
        </p>
        <section aria-labelledby="decisions-label" className="flex flex-col gap-2">
          <label
            id="decisions-label"
            htmlFor="summary-decisions"
            className="flex items-center gap-2 text-[14px] leading-[17px] font-bold"
          >
            <MeetingIllustration name="check" size={22} />
            정한 것
          </label>
          <AutoGrowTextarea
            id="summary-decisions"
            aria-invalid={!!errors.decisions}
            aria-describedby={errors.decisions ? 'decisions-error' : undefined}
            value={draft.decisionsText}
            onChange={(event) => update({ ...draft, decisionsText: event.target.value })}
            placeholder="한 줄에 하나씩: 주제는 '동아리 일정 관리'로"
            minHeight={110}
            className="bg-card shadow-card text-ink placeholder:text-icon-muted focus-visible:outline-accent rounded-[10px] [background-size:350px_110px] [background-repeat:repeat-y] px-4 pt-3.5 pb-3 text-[14px] leading-[26px] outline-none focus-visible:outline-2"
            style={{ backgroundImage: `url("${lines}")` }}
          />
          {errors.decisions && (
            <p id="decisions-error" className="text-danger text-[12px] leading-[16px]">
              {errors.decisions}
            </p>
          )}
        </section>
        <h2 className="flex items-center gap-1.5 pt-1 text-[14px] leading-[17px] font-bold">
          <MeetingIllustration name="people" size={24} />
          누가 언제까지
        </h2>
        {draft.actionItems.map((item, index) => (
          <SummaryActionRow
            key={item.id}
            item={item}
            index={index}
            errors={errors}
            onChange={(next) =>
              update({
                ...draft,
                actionItems: draft.actionItems.map((row) => (row.id === item.id ? next : row)),
              })
            }
            onRemove={() => {
              const remaining = draft.actionItems.filter((row) => row.id !== item.id)
              update({ ...draft, actionItems: remaining.length ? remaining : [newActionItem()] })
            }}
          />
        ))}
        {errors.actions && (
          <p role="alert" className="text-danger text-[12px] leading-[16px]">
            {errors.actions}
          </p>
        )}
        <button
          type="button"
          onClick={() => update({ ...draft, actionItems: [...draft.actionItems, newActionItem()] })}
          className="text-accent-deep self-start text-[14px] leading-[17px] font-bold"
        >
          + 한 줄 추가
        </button>
        {draftWarning && (
          <p role="status" className="text-danger text-[12px] leading-[16px]">
            {draftWarning}
          </p>
        )}
        {saveError && (
          <p role="alert" className="text-danger text-[13px] leading-[17px]">
            {saveError}
          </p>
        )}
        <div aria-hidden="true" className="min-h-0 flex-1" />
        <Button
          type="submit"
          disabled={saving}
          aria-busy={saving}
          className="shrink-0 leading-[22px]"
        >
          {saving ? '저장 중…' : '저장하기'}
        </Button>
      </ScreenContent>
    </form>
  )
}
