import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { BottomSheet } from '@/components/ui/BottomSheet'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { Illust } from '@/components/ui/Illust'
import * as api from '@/features/admin/api'
import { useInvalidateAdmin } from '@/features/admin/hooks/useInvalidateAdmin'
import { projectsQuery } from '@/features/admin/queries'
import { ASSIGNABLE_PARTS, PART_LABEL, type Member, type Part } from '@/features/admin/types'
import { useToast } from '@/hooks/useToast'

type Props = {
  member: Member | null
  isNew?: boolean
  onClose: () => void
}

/** SCR-ADM-05 멤버 배정 시트. 파트와 프로젝트를 둘 다 골라야 저장돼요 */
export function AssignSheet({ member, isNew = false, onClose }: Props) {
  const toast = useToast()
  const invalidate = useInvalidateAdmin()
  const { data: projects } = useQuery(projectsQuery())
  const [part, setPart] = useState<Part | null>(null)
  const [projectId, setProjectId] = useState<string | null>(null)

  // 시트가 열릴 때 현재 배정 상태로 초기화
  useEffect(() => {
    setPart(member?.part ?? null)
    setProjectId(member?.projectId ?? null)
  }, [member])

  const save = useMutation({
    mutationFn: () => {
      if (!member || !part || !projectId) throw new Error('파트와 프로젝트를 골라 주세요')
      return api.assignMember(member.id, { part, projectId })
    },
    onSuccess: async (saved) => {
      await invalidate()
      toast(`${saved.name} 님을 배정했어요`)
      onClose()
    },
    onError: (e: Error) => toast(e.message),
  })

  const teamProjects = projects?.filter((p) => p.kind === 'TEAM') ?? []
  const canSave = Boolean(part && projectId) && !save.isPending

  return (
    <BottomSheet
      open={member !== null}
      onClose={onClose}
      title={member ? `${member.name} 배정` : ''}
      illust="lion-happy"
      description={
        <span className="text-muted">
          {member?.email}
          {isNew && ' · 방금 가입'}
        </span>
      }
    >
      <p className="text-ink pt-1 text-[14px] leading-none font-bold">파트</p>
      <div className="flex w-full flex-wrap gap-1.5">
        {ASSIGNABLE_PARTS.map((p) => (
          <Chip key={p} selected={part === p} onClick={() => setPart(p)}>
            {PART_LABEL[p]}
          </Chip>
        ))}
      </div>

      <p className="text-ink pt-1 text-[14px] leading-none font-bold">프로젝트</p>
      <div className="flex w-full flex-wrap gap-1.5">
        {teamProjects.map((p) => (
          <Chip key={p.id} selected={projectId === p.id} onClick={() => setProjectId(p.id)}>
            {p.shortName}
          </Chip>
        ))}
      </div>

      <div className="bg-note flex w-full items-center gap-2 rounded-2xl px-[18px] py-3">
        <Illust name="clip" size={20} />
        <p className="text-ink-2 flex-1 text-[13px] leading-normal">
          바꿔도 이전 프로젝트의 일지는 그 분류에 남아요
        </p>
      </div>

      <div className="h-0.5" />

      <div className="flex w-full items-center gap-2">
        <Button variant="ghost" className="flex-1" onClick={onClose}>
          취소
        </Button>
        <Button className="flex-1" disabled={!canSave} onClick={() => save.mutate()}>
          저장하기
        </Button>
      </div>
    </BottomSheet>
  )
}
