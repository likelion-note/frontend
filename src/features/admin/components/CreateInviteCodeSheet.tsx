import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

import { BottomSheet } from '@/components/ui/BottomSheet'
import { Button } from '@/components/ui/Button'
import { Field, UnderlineInput } from '@/components/ui/Field'
import { Segment } from '@/components/ui/Segment'
import * as api from '@/features/admin/api'
import { today } from '@/features/admin/mock/store'
import { useInvalidateAdmin } from '@/features/admin/hooks/useInvalidateAdmin'
import type { UserType } from '@/features/admin/types'
import { useToast } from '@/hooks/useToast'

type Props = {
  open: boolean
  onClose: () => void
  /** 기본 기수 (운영진의 기수) */
  cohort: number
}

const TYPE_OPTIONS: { value: UserType; label: string }[] = [
  { value: 'MEMBER', label: '아기사자' },
  { value: 'ADMIN', label: '운영진' },
]

const DEFAULT_EXPIRES = '2026-12-31'

/** 새 초대코드 만들기 시트. 기수 · 계정 유형 · 만료일 */
export function CreateInviteCodeSheet({ open, onClose, cohort }: Props) {
  const toast = useToast()
  const invalidate = useInvalidateAdmin()
  const [cohortText, setCohortText] = useState(String(cohort))
  const [userType, setUserType] = useState<UserType>('MEMBER')
  const [expiresAt, setExpiresAt] = useState(DEFAULT_EXPIRES)

  const close = () => {
    setCohortText(String(cohort))
    setUserType('MEMBER')
    setExpiresAt(DEFAULT_EXPIRES)
    onClose()
  }

  const parsedCohort = Number(cohortText)
  const expired = expiresAt.length > 0 && expiresAt < today()
  const valid =
    Number.isInteger(parsedCohort) && parsedCohort > 0 && expiresAt.length > 0 && !expired

  const create = useMutation({
    mutationFn: () => api.createInviteCode({ cohort: parsedCohort, userType, expiresAt }),
    onSuccess: async (code) => {
      await invalidate()
      toast(`${code.code} 코드를 만들었어요`)
      close()
    },
    onError: (e: Error) => toast(e.message),
  })

  return (
    <BottomSheet
      open={open}
      onClose={close}
      title="새 코드 만들기"
      illust="lion-mail"
      description="기수와 계정 유형을 고르면 6자리 코드가 만들어져요."
    >
      <Field label="기수" htmlFor="code-cohort">
        <UnderlineInput
          id="code-cohort"
          type="number"
          inputMode="numeric"
          min={1}
          value={cohortText}
          onChange={(e) => setCohortText(e.target.value)}
          placeholder="예: 14"
        />
      </Field>

      <p className="text-ink pt-1 text-[14px] leading-none font-bold">계정 유형</p>
      <Segment options={TYPE_OPTIONS} value={userType} onChange={setUserType} />

      <Field label="만료일" htmlFor="code-expires" className="pt-1">
        <UnderlineInput
          id="code-expires"
          type="date"
          min={today()}
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
        />
      </Field>
      {expired && (
        <p role="alert" className="text-danger text-[12px] leading-normal">
          만료일은 오늘 이후로 골라 주세요.
        </p>
      )}

      <div className="h-1.5" />

      <div className="flex w-full items-center gap-2">
        <Button variant="ghost" className="flex-1" onClick={close}>
          취소
        </Button>
        <Button
          className="flex-1"
          disabled={!valid || create.isPending}
          onClick={() => create.mutate()}
        >
          만들기
        </Button>
      </div>
    </BottomSheet>
  )
}
