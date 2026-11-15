import { ChevronIcon } from '@/components/icons'
import { Pill } from '@/components/ui/Pill'
import { PART_LABEL, type Member } from '@/features/admin/types'
import { cn } from '@/lib/cn'

type Props = {
  member: Member
  /** 오늘 가입한 사람에게 "방금 가입" 을 붙여요 */
  isNew?: boolean
  onClick?: () => void
}

/** 멤버 한 줄: 이니셜 · 이름 · 이메일 · (파트 또는 화살표) */
export function MemberRow({ member, isNew = false, onClick }: Props) {
  const assigned = Boolean(member.part && member.projectId)
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 py-2.5 text-left active:opacity-80"
    >
      <span
        className={cn(
          'text-accent-deep flex size-[38px] shrink-0 items-center justify-center rounded-full text-[14px] font-bold',
          isNew ? 'bg-rose-2' : 'bg-accent-soft',
        )}
      >
        {member.name.charAt(0)}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-center gap-1.5">
          <span className="text-ink text-[15px] leading-tight font-bold">{member.name}</span>
          {isNew && <Pill tone="rose2">방금 가입</Pill>}
        </span>
        <span className="text-muted truncate text-[12px] leading-tight">{member.email}</span>
      </span>
      {assigned && member.part ? (
        <Pill tone="beige" size="sm">
          {PART_LABEL[member.part]}
        </Pill>
      ) : (
        <ChevronIcon />
      )}
    </button>
  )
}
