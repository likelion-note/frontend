import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field, UnderlineInput } from '@/components/ui/Field'
import { Illust } from '@/components/ui/Illust'
import * as api from '@/features/admin/api'
import { AdminBackHeader } from '@/features/admin/components/AdminHeader'
import { AdminContent } from '@/features/admin/components/AdminLayout'
import { useInvalidateAdmin } from '@/features/admin/hooks/useInvalidateAdmin'
import { meQuery } from '@/features/admin/queries'
import { useToast } from '@/hooks/useToast'

/** 프로필 설정. 온보딩 SCR-ONB-03 과 같은 구성으로, 이름·닉네임만 바꿀 수 있어요 */
export function ProfilePage() {
  const navigate = useNavigate()
  const toast = useToast()
  const invalidate = useInvalidateAdmin()
  const { data: me } = useQuery(meQuery())
  const [name, setName] = useState('')

  useEffect(() => {
    if (me) setName(me.name)
  }, [me])

  const save = useMutation({
    mutationFn: () => api.updateMe({ name }),
    onSuccess: async () => {
      await invalidate()
      toast('저장했어요')
      navigate(-1)
    },
    onError: (e: Error) => toast(e.message),
  })

  const trimmed = name.trim()
  const canSave = Boolean(me) && trimmed.length > 0 && trimmed !== me?.name && !save.isPending

  return (
    <>
      <AdminBackHeader title="프로필 설정" />
      <AdminContent>
        <Card className="flex items-center gap-3 py-3.5">
          <span className="bg-accent-soft text-accent-deep flex size-[38px] shrink-0 items-center justify-center rounded-full text-[14px] font-bold">
            {me?.name.charAt(0)}
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="text-ink truncate text-[15px] leading-tight font-bold">{me?.email}</p>
            <p className="text-muted text-[12px] leading-tight">
              구글 계정 연결됨 · {me?.cohort}기 운영진
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
          <Illust name="lion-glasses" size={40} />
          <div className="flex min-w-0 flex-1 flex-col gap-[3px] text-[13px] leading-normal">
            <p className="text-note-ink font-bold">운영진 계정이에요</p>
            <p className="text-ink-2">
              성장일지를 쓰면 운영 분류로 묶이고, 내가 쓴 일지는 다른 운영진이 검토해요.
            </p>
          </div>
        </div>

        <div className="flex-1" />

        <Button disabled={!canSave} onClick={() => save.mutate()}>
          저장하기
        </Button>
      </AdminContent>
    </>
  )
}
