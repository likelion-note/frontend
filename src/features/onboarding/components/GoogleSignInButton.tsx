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
 * 구글 로그인 버튼. 우리 디자인의 버튼 위에 구글 공식 버튼을 투명하게 겹쳐서,
 * 보이는 건 우리 버튼이고 눌리는 건 구글 버튼이에요 (ID 토큰은 공식 버튼으로만 받을 수 있어요).
 */
export function GoogleSignInButton({ onCredential, onError, disabled = false }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const onCredentialRef = useRef(onCredential)
  const onErrorRef = useRef(onError)
  onCredentialRef.current = onCredential
  onErrorRef.current = onError

  useEffect(() => {
    let cancelled = false
    const overlay = overlayRef.current
    if (!overlay) return

    loadGoogleIdentity()
      .then((google) => {
        if (cancelled) return
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (res) => onCredentialRef.current(res.credential),
          ux_mode: 'popup',
          itp_support: true,
        })
        overlay.innerHTML = ''
        google.accounts.id.renderButton(overlay, {
          type: 'standard',
          size: 'large',
          text: 'continue_with',
          shape: 'pill',
          logo_alignment: 'center',
          width: Math.min(400, Math.max(200, Math.round(overlay.clientWidth || 350))),
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
    <div className="relative w-full">
      <Button variant="ghost" className="gap-2" disabled={disabled || !ready} tabIndex={-1}>
        <GoogleIcon />
        Google 계정으로 계속하기
      </Button>
      {/* 구글 공식 버튼. 투명하게 겹쳐서 클릭만 받아요 */}
      <div
        ref={overlayRef}
        aria-label="Google 계정으로 계속하기"
        className={cn(
          'absolute inset-0 flex items-center justify-center overflow-hidden opacity-0 [&_iframe]:!h-[50px] [&>div]:h-full [&>div]:w-full',
          (disabled || !ready) && 'pointer-events-none',
        )}
      />
    </div>
  )
}
