import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

import { BottomSheet } from '@/components/ui/BottomSheet'
import { Button } from '@/components/ui/Button'
import { Segment } from '@/components/ui/Segment'
import * as api from '@/features/admin/api'
import { useInvalidateAdmin } from '@/features/admin/hooks/useInvalidateAdmin'
import type { ProjectKind } from '@/features/admin/types'
import { useToast } from '@/hooks/useToast'

type Props = {
  open: boolean
  onClose: () => void
}

const KIND_OPTIONS: { value: ProjectKind; label: string }[] = [
  { value: 'TEAM', label: '아기사자 팀' },
  { value: 'OPS', label: '운영' },
]

/** SCR-ADM-06 프로젝트 분류 만들기 시트. 제목만 적으면 돼요 */
export function CreateProjectSheet({ open, onClose }: Props) {
  const toast = useToast()
  const invalidate = useInvalidateAdmin()
  const [title, setTitle] = useState('')
  const [kind, setKind] = useState<ProjectKind>('TEAM')

  const close = () => {
    setTitle('')
    setKind('TEAM')
    onClose()
  }

  const create = useMutation({
    mutationFn: () => api.createProject({ title, kind }),
    onSuccess: async (project) => {
      await invalidate()
      toast(`"${project.title}" 분류를 만들었어요`)
      close()
    },
    onError: (e: Error) => toast(e.message),
  })

  const canCreate = title.trim().length > 0 && !create.isPending

  return (
    <BottomSheet
      open={open}
      onClose={close}
      title="프로젝트 분류 만들기"
      illust="folder"
      illustSize={30}
      description="제목만 만들면 돼요. 아기사자는 멤버 목록에서 배정해요."
    >
      <div className="flex w-full flex-col gap-1.5">
        <label htmlFor="project-title" className="text-ink text-[14px] leading-none font-bold">
          분류 제목
        </label>
        <input
          id="project-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && canCreate) create.mutate()
          }}
          placeholder="예: 14기 해커톤 · 새팀"
          className="border-input-line text-ink placeholder:text-placeholder h-[46px] w-full rounded-none border-b-[1.4px] bg-transparent px-0.5 text-[15px] outline-none"
        />
      </div>

      <p className="text-ink pt-1 text-[14px] leading-none font-bold">종류</p>
      <Segment options={KIND_OPTIONS} value={kind} onChange={setKind} />

      <div className="h-1.5" />

      <div className="flex w-full items-center gap-2">
        <Button variant="ghost" className="flex-1" onClick={close}>
          취소
        </Button>
        <Button className="flex-1" disabled={!canCreate} onClick={() => create.mutate()}>
          만들기
        </Button>
      </div>
    </BottomSheet>
  )
}
