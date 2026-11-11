import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'

import { BackHeader, ScreenContent } from '@/components/layout/Screen'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field, UnderlineInput } from '@/components/ui/Field'
import { Illust } from '@/components/ui/Illust'
import { useInvalidateAdmin } from '@/features/admin/hooks/useInvalidateAdmin'
import * as api from '@/features/onboarding/api'
import { getDraft, homePathFor, setDraft, setSession } from '@/features/onboarding/session'
import { useToast } from '@/hooks/useToast'

/** SCR-ONB-03 프로필 설정 (처음 로그인) */
export function ProfileSetupPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const invalidate = useInvalidateAdmin()
  const [draft] = useState(getDraft)
  const [name, setName] = useState('')

  const signup = useMutation({
    mutationFn: () => {
      if (!draft) throw new Error('처음부터 다시 진행해 주세요')
      return api.completeSignup({ ...draft, name })
    },
    onSuccess: async () => {
      if (!draft) return
      setSession({
        name: name.trim(),
        email: draft.email,
        cohort: draft.cohort,
        userType: draft.userType,
      })
      setDraft(null)
      await invalidate()
      toast(draft.userType === 'ADMIN' ? '운영진으로 시작해요' : '가입을 마쳤어요')
      navigate(homePathFor(draft.userType), { replace: true })
    },
    onError: (e: Error) => toast(e.message),
  })

  if (!draft) return <Navigate to="/onboarding" replace />

  const isAdmin = draft.userType === 'ADMIN'
  const typeLabel = isAdmin ? '운영진' : '아기사자'
  const canStart = name.trim().length > 0 && !signup.isPending

  return (
    <>
      <BackHeader title="프로필 설정" backTo="/onboarding/code" />
      <ScreenContent>
        <Card className="flex items-center gap-3 py-3.5">
          <span className="bg-accent-soft text-accent-deep flex size-[38px] shrink-0 items-center justify-center rounded-full text-[14px] font-bold">
            {name.trim().charAt(0) || '새'}
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="text-ink truncate text-[15px] leading-tight font-bold">{draft.email}</p>
            <p className="text-muted text-[12px] leading-tight">
              구글 계정 연결됨 · {draft.cohort}기 {typeLabel}
            </p>
          </div>
        </Card>

        <Field label="이름 또는 닉네임" htmlFor="signup-name" className="pt-1">
          <UnderlineInput
            id="signup-name"
            value={name}
            maxLength={30}
            autoFocus
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && canStart) signup.mutate()
            }}
            placeholder="운영진이 멤버를 알아볼 이름"
          />
        </Field>
        <p className="text-muted text-[12px] leading-normal">
          운영진의 멤버 목록에만 보여요. 성장일지와 노트에는 어디에도 나오지 않아요.
        </p>

        <div className="bg-note flex w-full items-start gap-2.5 rounded-2xl px-[18px] py-4">
          <Illust name={isAdmin ? 'lion-glasses' : 'lion-happy'} size={40} />
          <div className="flex min-w-0 flex-1 flex-col gap-[3px] text-[13px] leading-normal">
            {isAdmin ? (
              <>
                <p className="text-note-ink font-bold">운영진 계정이에요</p>
                <p className="text-ink-2">
                  성장일지를 쓰면 운영 분류로 묶이고, 내가 쓴 일지는 다른 운영진이 검토해요.
                </p>
              </>
            ) : (
              <>
                <p className="text-note-ink font-bold">파트와 프로젝트는 운영진이 배정해요</p>
                <p className="text-ink-2">배정되면 홈에 내 파트의 이번 주 할 일이 나타나요.</p>
              </>
            )}
          </div>
        </div>

        <div className="flex-1" />

        <Button disabled={!canStart} onClick={() => signup.mutate()}>
          시작하기
        </Button>
      </ScreenContent>
    </>
  )
}
