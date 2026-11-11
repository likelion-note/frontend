import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import appIcon from '@/assets/brand/app-icon.png'
import logo from '@/assets/brand/logo.svg'
import { GoogleIcon } from '@/components/icons'
import { ScreenContent } from '@/components/layout/Screen'
import { Button } from '@/components/ui/Button'
import { Illust } from '@/components/ui/Illust'
import * as api from '@/features/onboarding/api'
import { AccountSelectSheet } from '@/features/onboarding/components/AccountSelectSheet'
import { homePathFor, setDraft, setSession } from '@/features/onboarding/session'
import { useToast } from '@/hooks/useToast'

/** SCR-ONB-01 시작 · 구글 로그인 */
export function StartPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [picking, setPicking] = useState(false)

  const login = useMutation({
    mutationFn: (accountId: string) => api.loginWithGoogle(accountId),
    onSuccess: (result) => {
      setPicking(false)
      if (result.isNew) {
        setDraft(null)
        navigate('/onboarding/code', { state: { email: result.email } })
        return
      }
      setSession({
        name: result.name,
        email: result.email,
        cohort: result.cohort,
        userType: result.userType,
      })
      navigate(homePathFor(result.userType), { replace: true })
    },
    onError: (e: Error) => toast(e.message),
  })

  return (
    <>
      <ScreenContent className="pt-10">
        <div className="flex flex-col items-center gap-4 pt-6">
          <img src={appIcon} alt="" width={72} height={72} className="size-[72px]" />
          <img src={logo} alt="멋사수첩" width={232} height={140} className="h-[140px] w-[232px]" />
        </div>

        <p className="text-ink-2 text-center text-[15px] leading-relaxed font-medium">
          지난 기수가 프로젝트에서 실제로 막혔던 순간과
          <br />
          넘긴 방법을, 지금 내 파트와 주차에 맞춰 펼쳐 봐요.
        </p>

        <div className="bg-note mx-auto mt-2 flex w-full items-center gap-3 rounded-2xl px-[18px] py-4">
          <Illust name="lion-happy" size={44} />
          <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
            <p className="text-note-ink text-[14px] leading-snug font-bold">
              “올해 내 기록이 내년 아기사자의 선배 노트가 돼요”
            </p>
            <p className="text-ink-2 text-[12px] leading-tight">지난 기수 운영진의 한마디</p>
          </div>
        </div>

        <div className="flex-1" />

        <Button
          variant="ghost"
          className="gap-2"
          disabled={login.isPending}
          onClick={() => setPicking(true)}
        >
          <GoogleIcon />
          Google 계정으로 계속하기
        </Button>
        <p className="text-muted text-center text-[12px] leading-normal">
          처음이면 운영진에게 받은 초대코드를 한 번 입력해요
        </p>
      </ScreenContent>

      <AccountSelectSheet
        open={picking}
        onClose={() => setPicking(false)}
        onSelect={(account) => login.mutate(account.id)}
        busy={login.isPending}
      />
    </>
  )
}
