import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { USE_MOCK } from '@/api/client'
import { BackHeader, ScreenContent } from '@/components/layout/Screen'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field, UnderlineInput } from '@/components/ui/Field'
import { Illust } from '@/components/ui/Illust'
import * as api from '@/features/admin/api'
import { resetMockData } from '@/features/admin/mock/store'
import { meQuery } from '@/features/admin/queries'
import { PART_LABEL } from '@/features/admin/types'
import { clearAuth, homePathFor } from '@/features/onboarding/session'
import { useToast } from '@/hooks/useToast'
import { getCurrentUser } from '@/lib/currentUser'

/**
 * 프로필 설정. 아기사자와 운영진이 같이 써요 (홈 · 검토 홈의 아바타에서 들어와요).
 * 이름·닉네임을 바꾸고 로그아웃할 수 있어요. 파트와 프로젝트는 운영진이 배정해요.
 */
export function ProfilePage() {
  const navigate = useNavigate()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { data: me } = useQuery(meQuery())
  const user = getCurrentUser()
  const [name, setName] = useState('')

  useEffect(() => {
    if (me) setName(me.name)
  }, [me])

  const save = useMutation({
    mutationFn: () => api.updateMe({ name }),
    onSuccess: async () => {
      await queryClient.invalidateQueries()
      toast('저장했어요')
    },
    onError: (e: Error) => toast(e.message),
  })

  const logout = () => {
    clearAuth()
    queryClient.clear()
    navigate('/onboarding', { replace: true })
  }

  const resetDemo = () => {
    if (!window.confirm('데모 데이터를 처음 상태로 돌릴까요? 로그인도 풀려요.')) return
    resetMockData()
    window.location.replace('/')
  }

  const isAdminUser = user?.userType === 'ADMIN'
  const typeLabel = isAdminUser ? '운영진' : '아기사자'
  const assignment =
    user?.part && user.project && !isAdminUser
      ? `${PART_LABEL[user.part]} · ${user.project.shortName}`
      : null
  const trimmed = name.trim()
  const canSave = Boolean(me) && trimmed.length > 0 && trimmed !== me?.name && !save.isPending

  return (
    <>
      <BackHeader title="프로필 설정" backTo={user ? homePathFor(user.userType) : '/'} />
      <ScreenContent>
        <Card className="flex items-center gap-3 py-3.5">
          <span className="bg-accent-soft text-accent-deep flex size-[38px] shrink-0 items-center justify-center rounded-full text-[14px] font-bold">
            {me?.name.charAt(0)}
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="text-ink truncate text-[15px] leading-tight font-bold">
              {me?.email || '구글 계정'}
            </p>
            <p className="text-muted text-[12px] leading-tight">
              구글 계정 연결됨 · {user?.cohort}기 {typeLabel}
              {assignment && ` · ${assignment}`}
            </p>
          </div>
        </Card>

        <Field label="이름 또는 닉네임" htmlFor="profile-name" className="pt-1">
          <UnderlineInput
            id="profile-name"
            value={name}
            maxLength={30}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && canSave) save.mutate()
            }}
            placeholder="운영진이 멤버를 알아볼 이름"
          />
        </Field>
        <p className="text-muted text-[12px] leading-normal">
          운영진의 멤버 목록에만 보여요. 성장일지와 노트에는 어디에도 나오지 않아요.
        </p>

        <div className="bg-note flex w-full items-start gap-2.5 rounded-2xl px-[18px] py-4">
          <Illust name={isAdminUser ? 'lion-glasses' : 'lion-happy'} size={40} />
          <div className="flex min-w-0 flex-1 flex-col gap-[3px] text-[13px] leading-normal">
            {isAdminUser ? (
              <>
                <p className="text-note-ink font-bold">운영진 계정이에요</p>
                <p className="text-ink-2">
                  성장일지를 쓰면 운영 분류로 묶이고, 내가 쓴 일지는 다른 운영진이 검토해요.
                </p>
              </>
            ) : assignment ? (
              <>
                <p className="text-note-ink font-bold">{assignment}에 배정됐어요</p>
                <p className="text-ink-2">파트와 프로젝트는 운영진이 바꿀 수 있어요.</p>
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

        <Button disabled={!canSave} onClick={() => save.mutate()}>
          저장하기
        </Button>
        <div className="flex items-center justify-center gap-4 py-1">
          <button
            type="button"
            onClick={logout}
            className="text-muted relative text-[13px] font-medium underline underline-offset-4 before:absolute before:-inset-2"
          >
            로그아웃
          </button>
          {USE_MOCK && (
            <button
              type="button"
              onClick={resetDemo}
              className="text-muted relative text-[13px] font-medium underline underline-offset-4 before:absolute before:-inset-2"
            >
              데모 데이터 처음으로
            </button>
          )}
        </div>
      </ScreenContent>
    </>
  )
}
