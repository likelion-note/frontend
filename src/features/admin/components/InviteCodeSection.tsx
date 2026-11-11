import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { CopyIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Switch } from '@/components/ui/Switch'
import * as api from '@/features/admin/api'
import { CreateInviteCodeSheet } from '@/features/admin/components/CreateInviteCodeSheet'
import { useInvalidateAdmin } from '@/features/admin/hooks/useInvalidateAdmin'
import { inviteCodesQuery, meQuery } from '@/features/admin/queries'
import type { InviteCode } from '@/features/admin/types'
import { cn } from '@/lib/cn'
import { formatMonthDay } from '@/lib/date'
import { useToast } from '@/hooks/useToast'

/** SCR-ADM-08 운영 › 초대코드 칸 */
export function InviteCodeSection() {
  const toast = useToast()
  const invalidate = useInvalidateAdmin()
  const { data: me } = useQuery(meQuery())
  const { data: codes = [] } = useQuery(inviteCodesQuery())
  const [creating, setCreating] = useState(false)
  const cohort = me?.cohort ?? 14

  const toggle = useMutation({
    mutationFn: (id: string) => api.toggleInviteCode(id),
    onSuccess: async (code) => {
      await invalidate()
      toast(code.enabled ? `${code.code} 코드를 켰어요` : `${code.code} 코드를 껐어요`)
    },
    onError: (e: Error) => toast(e.message),
  })

  const copy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      toast(`${code} 코드를 복사했어요`)
    } catch {
      toast('복사하지 못했어요. 직접 적어 주세요')
    }
  }

  return (
    <>
      <p className="text-ink-2 text-[13px] leading-normal">
        구글 로그인 후 처음 한 번만 입력하는 코드예요. 코드가 기수와 계정 유형(아기사자·운영진)을
        정해요.
      </p>

      {codes.map((code) => (
        <InviteCodeCard
          key={code.id}
          code={code}
          currentCohort={cohort}
          onToggle={() => toggle.mutate(code.id)}
          onCopy={() => copy(code.code)}
        />
      ))}

      <Button onClick={() => setCreating(true)}>+ 새 코드 만들기</Button>
      <p className="text-muted w-full text-center text-[12px] leading-normal">
        스위치를 끄면 그 코드로는 바로 가입이 막혀요.
      </p>

      <CreateInviteCodeSheet open={creating} onClose={() => setCreating(false)} cohort={cohort} />
    </>
  )
}

function InviteCodeCard({
  code,
  currentCohort,
  onToggle,
  onCopy,
}: {
  code: InviteCode
  currentCohort: number
  onToggle: () => void
  onCopy: () => void
}) {
  const typeLabel = code.userType === 'MEMBER' ? '아기사자' : '운영진'
  const expiry = code.cohort < currentCohort ? '지난 기수' : `${formatMonthDay(code.expiresAt)}까지`
  const off = !code.enabled

  return (
    <Card className={cn('flex flex-col gap-2.5', off && 'opacity-70')}>
      <div className="flex w-full items-center gap-2">
        <div
          className={cn('flex min-w-0 flex-1 flex-col gap-0.5', off ? 'text-muted' : 'text-ink')}
        >
          <p className="text-[22px] leading-tight font-bold">{code.code}</p>
          <p className="text-muted text-[12px] leading-tight">
            {code.cohort}기 {typeLabel} · 가입 {code.usedCount}명 · {expiry}
          </p>
        </div>
        <Switch checked={code.enabled} onChange={onToggle} label={`${code.code} 켜기·끄기`} />
      </div>
      <div className="flex w-full items-center gap-2">
        <button
          type="button"
          onClick={onCopy}
          className={cn(
            'flex items-center gap-1 rounded-full py-[7px] pr-3.5 pl-3 text-[13px] leading-none font-bold',
            off ? 'bg-beige text-muted' : 'bg-accent-soft text-accent-deep',
          )}
        >
          <CopyIcon className={off ? 'text-muted' : 'text-accent-deep'} />
          코드 복사
        </button>
        <div className="flex-1" />
        {off && (
          <span className="text-muted text-[12px] leading-none font-medium">꺼짐 · 가입 막힘</span>
        )}
      </div>
    </Card>
  )
}
