import { useEffect, useRef, useState } from 'react'

import { GOOGLE_CLIENT_ID } from '@/api/client'
import { GoogleIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { loadGoogleIdentity } from '@/lib/googleIdentity'

type Props = {
  /** 구글이 준 ID 토큰. 백엔드 POST /api/auth/google 로 보내요 */
  onCredential: (idToken: string) => void
  onError?: (message: string) => void
  disabled?: boolean
}

/**
 * 구글 로그인 버튼. ID 토큰은 구글 공식 버튼으로만 받을 수 있어서 공식 버튼을 그대로 보여줘요.
 *
 * 예전에는 우리 버튼 위에 공식 버튼을 투명하게 겹쳤는데, 구글은 보이지 않는 버튼이 눌리는 걸
 * 막아요 (PC의 둥근 폰 프레임 안에서 실제로 안 눌렸어요). 그래서 가리지 않고 보이게 둬요.
 * 공식 버튼이 준비되기 전에는 같은 자리에 우리 버튼을 비활성으로 보여줘요.
 */
export function GoogleSignInButton({ onCredential, onError, disabled = false }: Props) {
  const slotRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const onCredentialRef = useRef(onCredential)
  const onErrorRef = useRef(onError)
  onCredentialRef.current = onCredential
  onErrorRef.current = onError

  useEffect(() => {
    let cancelled = false
    const slot = slotRef.current
    if (!slot) return

    loadGoogleIdentity()
      .then((google) => {
        if (cancelled) return
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (res) => onCredentialRef.current(res.credential),
          ux_mode: 'popup',
          itp_support: true,
        })
        slot.innerHTML = ''
        google.accounts.id.renderButton(slot, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'pill',
          logo_alignment: 'center',
          width: Math.min(400, Math.max(200, Math.round(slot.clientWidth || 350))),
          locale: 'ko',
        })
        setReady(true)
      })
      .catch((e: Error) => {
        if (!cancelled) onErrorRef.current?.(e.message)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="relative flex min-h-[50px] w-full items-center justify-center">
      {!ready && (
        <Button variant="ghost" className="gap-2" disabled tabIndex={-1}>
          <GoogleIcon />
          Google 계정으로 계속하기
        </Button>
      )}
      {/* 구글 공식 버튼이 그려지는 자리. 로그인 요청 중에는 다시 못 누르게 해요 */}
      <div
        ref={slotRef}
        className={cn(
          'flex w-full items-center justify-center transition-opacity',
          !ready && 'invisible absolute inset-0',
          disabled && 'pointer-events-none opacity-50',
        )}
      />
    </div>
  )
}
