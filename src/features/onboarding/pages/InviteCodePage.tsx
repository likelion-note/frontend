import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router'

import { BackHeader, ScreenContent } from '@/components/layout/Screen'
import { Button } from '@/components/ui/Button'
import * as api from '@/features/onboarding/api'
import { CodeInput } from '@/features/onboarding/components/CodeInput'
import { getDraft, setDraft } from '@/features/onboarding/session'
import { cn } from '@/lib/cn'

const CODE_LENGTH = 6

/** SCR-ONB-02 초대코드 입력 */
export function InviteCodePage() {
  const navigate = useNavigate()
  const [draft] = useState(getDraft)
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)

  const verify = useMutation({
    mutationFn: (value: string) => api.verifyInviteCode(value),
    onError: (e: Error) => setError(e.message),
  })

  // 6자리가 차면 바로 확인해요
  useEffect(() => {
    if (code.length === CODE_LENGTH) verify.mutate(code)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  const handleChange = (next: string) => {
    setCode(next)
    setError(null)
    if (next.length < CODE_LENGTH) verify.reset()
  }

  // 구글 로그인을 거치지 않고 들어오면 처음으로
  if (!draft) return <Navigate to="/onboarding" replace />

  const result = verify.data
  const ready = Boolean(result) && code.length === CODE_LENGTH && !error
  const typeLabel = result?.userType === 'ADMIN' ? '운영진' : '아기사자'

  const next = () => {
    if (!result) return
    setDraft({ ...draft, cohort: result.cohort, userType: result.userType, code })
    navigate('/onboarding/profile')
  }

  return (
    <>
      <BackHeader title="초대코드 입력" backTo="/onboarding" />
      <ScreenContent>
        <p className="text-ink-2 text-[13px] leading-normal">
          처음 로그인할 때 한 번만 입력해요. 코드에 기수와 계정 유형이 들어 있어요.
        </p>

        <CodeInput value={code} onChange={handleChange} error={Boolean(error)} />

        <div
          role="status"
          className={cn(
            'min-h-[46px] w-full rounded-2xl px-4 py-3.5 text-[14px] leading-tight font-bold transition-colors',
            error
              ? 'bg-rose-2 text-danger'
              : ready
                ? 'bg-accent-soft text-ink'
                : 'text-muted bg-transparent font-medium',
          )}
        >
          {error
            ? error
            : ready && result
              ? `${result.cohort}기 ${typeLabel}로 가입합니다`
              : verify.isPending
                ? '코드를 확인하고 있어요…'
                : '운영진에게 받은 6자리 코드를 입력해 주세요'}
        </div>

        <div className="flex-1" />

        <Button disabled={!ready} onClick={next}>
          확인
        </Button>
      </ScreenContent>
    </>
  )
}
