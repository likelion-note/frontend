import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import { GOOGLE_CLIENT_ID, USE_MOCK } from '@/api/client'
import appIcon from '@/assets/brand/app-icon.png'
import logo from '@/assets/brand/logo.svg'
import { GoogleIcon } from '@/components/icons'
import { ScreenContent } from '@/components/layout/Screen'
import { Button } from '@/components/ui/Button'
import { Illust } from '@/components/ui/Illust'
import * as api from '@/features/onboarding/api'
import { AccountSelectSheet } from '@/features/onboarding/components/AccountSelectSheet'
import { GoogleSignInButton } from '@/features/onboarding/components/GoogleSignInButton'
import { homePathFor, setDraft, setSession } from '@/features/onboarding/session'
import { useToast } from '@/hooks/useToast'

/** 실제 구글 로그인은 목이 아니고 클라이언트 ID 가 있을 때만 */
const REAL_GOOGLE_LOGIN = !USE_MOCK && GOOGLE_CLIENT_ID.length > 0

/** SCR-ONB-01 시작 · 구글 로그인 */
export function StartPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [picking, setPicking] = useState(false)

  const login = useMutation({
    mutationFn: (input: api.LoginInput) => api.loginWithGoogle(input),
    onSuccess: (result) => {
      setPicking(false)
      if (result.status === 'NEED_SIGNUP') {
        setDraft({ email: result.email, signupToken: result.signupToken })
        navigate('/onboarding/code')
        return
      }
      setSession(result.session)
      navigate(homePathFor(result.session.user.userType), { replace: true })
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

        {REAL_GOOGLE_LOGIN ? (
          <GoogleSignInButton
            disabled={login.isPending}
            onCredential={(idToken) => login.mutate({ idToken })}
            onError={(message) => toast(message)}
          />
        ) : (
          <Button
            variant="ghost"
            className="gap-2"
            disabled={login.isPending}
            onClick={() => setPicking(true)}
          >
            <GoogleIcon />
            Google 계정으로 계속하기
          </Button>
        )}
        <p className="text-muted text-center text-[12px] leading-normal">
          {login.isPending
            ? '로그인하고 있어요…'
            : '처음이면 운영진에게 받은 초대코드를 한 번 입력해요'}
        </p>
      </ScreenContent>

      {!REAL_GOOGLE_LOGIN && (
        <AccountSelectSheet
          open={picking}
          onClose={() => setPicking(false)}
          onSelect={(account) => login.mutate({ mockAccountId: account.id })}
          busy={login.isPending}
        />
      )}
    </>
  )
}
