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

/**
 * SCR-ADM-05 멤버 배정 시트.
 * - 아기사자: 파트와 프로젝트(아기사자 팀)를 둘 다 골라야 저장돼요
 * - 운영진: 운영 분류만 골라요. 파트는 항상 운영진(OPS)이에요
 */
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
      if (!member || !projectId) throw new Error('프로젝트를 골라 주세요')
      if (member.type === 'ADMIN') return api.assignMember(member.id, { part: 'OPS', projectId })
      if (!part) throw new Error('파트와 프로젝트를 골라 주세요')
      return api.assignMember(member.id, { part, projectId })
    },
    onSuccess: async (saved) => {
      await invalidate()
      toast(`${saved.name} 님을 배정했어요`)
      onClose()
    },
    onError: (e: Error) => toast(e.message),
  })

  const unassign = useMutation({
    mutationFn: () => {
      if (!member) throw new Error('멤버를 찾을 수 없어요')
      return api.unassignMember(member.id)
    },
    onSuccess: async (saved) => {
      await invalidate()
      toast(`${saved.name} 님의 배정을 풀었어요`)
      onClose()
    },
    onError: (e: Error) => toast(e.message),
  })

  const staff = member?.type === 'ADMIN'
  // 아기사자는 아기사자 팀, 운영진은 운영 분류에서 골라요
  const choices = projects?.filter((p) => p.kind === (staff ? 'OPS' : 'TEAM')) ?? []
  const busy = save.isPending || unassign.isPending
  const assigned = staff ? Boolean(member?.projectId) : Boolean(member?.part && member.projectId)
  const projectChanged = projectId !== (member?.projectId ?? null)
  const changed = staff ? projectChanged : projectChanged || part !== (member?.part ?? null)
  const canSave = Boolean(projectId && (staff || part)) && changed && !busy

  return (
    <BottomSheet
      open={member !== null}
      onClose={onClose}
      title={member ? `${member.name} 배정` : ''}
      illust="lion-happy"
      description={
        <span className="text-muted">
          {member?.email}
          {staff && ' · 운영진'}
          {isNew && ' · 방금 가입'}
        </span>
      }
    >
      {!staff && (
        <>
          <p className="text-ink pt-1 text-[14px] leading-none font-bold">파트</p>
          <div className="flex w-full flex-wrap gap-1.5">
            {ASSIGNABLE_PARTS.map((p) => (
              <Chip key={p} selected={part === p} onClick={() => setPart(p)}>
                {PART_LABEL[p]}
              </Chip>
            ))}
          </div>
        </>
      )}

      <p className="text-ink pt-1 text-[14px] leading-none font-bold">
        {staff ? '운영 분류' : '프로젝트'}
      </p>
      <div className="flex w-full flex-wrap gap-1.5">
        {choices.map((p) => (
          <Chip key={p.id} selected={projectId === p.id} onClick={() => setProjectId(p.id)}>
            {p.shortName}
          </Chip>
        ))}
        {choices.length === 0 && (
          <p className="text-muted text-[13px] leading-normal">
            {staff
              ? "아직 운영 분류가 없어요. '프로젝트 분류 만들기'에서 종류를 운영으로 만들어 주세요."
              : "아직 아기사자 팀이 없어요. '프로젝트 분류 만들기'로 먼저 만들어 주세요."}
          </p>
        )}
      </div>

      <div className="bg-note flex w-full items-center gap-2 rounded-2xl px-[18px] py-3">
        <Illust name="clip" size={20} />
        <p className="text-ink-2 flex-1 text-[13px] leading-normal">
          {staff
            ? '운영진이 쓴 일지는 이 분류로 묶이고, 노트에는 운영진으로 올라가요'
            : '바꿔도 이전 프로젝트의 일지는 그 분류에 남아요'}
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
      {assigned && (
        <button
          type="button"
          disabled={busy}
          onClick={() => unassign.mutate()}
          className="text-muted relative self-center text-[13px] font-medium underline underline-offset-4 before:absolute before:-inset-2 disabled:opacity-50"
        >
          배정 풀기
        </button>
      )}
    </BottomSheet>
  )
}
