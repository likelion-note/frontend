import { useQuery } from '@tanstack/react-query'
import type { ComponentType } from 'react'
import { NavLink, useLocation } from 'react-router'

import activeHomeIcon from '@/assets/home/nav-home.svg'
import homeIcon from '@/assets/meeting/nav-home.svg'
import activeMeetIcon from '@/assets/meeting/nav-meet.svg'
import meetIcon from '@/assets/home/nav-meet.svg'
import notesIcon from '@/assets/home/nav-notes.svg'
import recordIcon from '@/assets/home/nav-record.svg'
import activeRecordIcon from '@/assets/journal/nav-record-active.svg'
import activeNotesIcon from '@/assets/note/nav-notes-active.svg'
import { MemberTabIcon, OpsTabIcon, ReviewTabIcon } from '@/components/icons'
import { summaryQuery } from '@/features/admin/queries'
import { canUseMeeting } from '@/features/home/state'
import { useHomeMode } from '@/features/home/useHomeMode'
import { cn } from '@/lib/cn'
import { isAdmin } from '@/lib/currentUser'

type IconComponent = ComponentType<{ active?: boolean; className?: string }>

export interface BottomNavItem {
  id: string
  label: string
  /** 이미지 경로 또는 아이콘 컴포넌트 */
  icon: string | IconComponent
  activeIcon?: string
  /** 목적지 화면 구현 후 경로를 지정해요. 없으면 비활성화해요. */
  to?: string
  /** false면 하위 경로(/admin/ops/schedule)에서도 켜져요. 기본은 정확히 같은 경로만 */
  end?: boolean
}

const memberNavItems: readonly BottomNavItem[] = [
  { id: 'home', label: '홈', icon: homeIcon, activeIcon: activeHomeIcon, to: '/home' },
  { id: 'meet', label: '회의', icon: meetIcon, activeIcon: activeMeetIcon, to: '/meeting' },
  { id: 'notes', label: '노트', icon: notesIcon, activeIcon: activeNotesIcon, to: '/notes' },
  { id: 'record', label: '내 기록', icon: recordIcon, activeIcon: activeRecordIcon, to: '/me' },
]

/** 운영진 메뉴: 검토 · 멤버 · 운영 · 노트 · 내 기록. 노트와 내 기록은 아기사자와 같은 화면이에요 */
const adminNavItems: readonly BottomNavItem[] = [
  { id: 'review', label: '검토', icon: ReviewTabIcon, to: '/admin/review' },
  { id: 'members', label: '멤버', icon: MemberTabIcon, to: '/admin/members' },
  { id: 'ops', label: '운영', icon: OpsTabIcon, to: '/admin/ops', end: false },
  { id: 'notes', label: '노트', icon: notesIcon, activeIcon: activeNotesIcon, to: '/notes' },
  { id: 'record', label: '내 기록', icon: recordIcon, activeIcon: activeRecordIcon, to: '/me' },
]

/**
 * 하단 탭. 로그인한 계정 유형에 따라 아기사자 메뉴 또는 운영진 메뉴를 보여줘요.
 * 노트 · 내 기록처럼 둘이 같이 쓰는 화면에서도 자기 메뉴가 유지돼요.
 * - 아기사자: 프로젝트 기간이 아니면 회의 탭이 꺼져요 (배정 전에는 쓸 수 있어요)
 * - 운영진: 검토 탭에 검토 대기 수 배지가 붙어요
 */
export function BottomNav({
  items,
  meetingAvailable,
}: {
  items?: readonly BottomNavItem[]
  meetingAvailable?: boolean
}) {
  const location = useLocation()
  const admin = isAdmin()
  const mode = useHomeMode()
  const { data: summary } = useQuery({ ...summaryQuery(), enabled: admin })
  const pending = admin ? (summary?.pendingCount ?? 0) : 0

  const navItems = items ?? (admin ? adminNavItems : memberNavItems)
  const meetOk = meetingAvailable ?? canUseMeeting(mode)

  const content = (item: BottomNavItem, active: boolean) => {
    const Icon = typeof item.icon === 'string' ? null : item.icon
    return (
      <>
        {Icon ? (
          <Icon active={active} className={active ? 'text-accent' : 'text-icon-muted'} />
        ) : (
          <img
            src={active ? (item.activeIcon ?? (item.icon as string)) : (item.icon as string)}
            width={24}
            height={24}
            alt=""
          />
        )}
        <span
          className={cn(
            'text-[11px] leading-[13px]',
            active ? 'text-accent font-bold' : 'text-muted font-medium',
          )}
        >
          {item.label}
        </span>
        {item.id === 'review' && pending > 0 && (
          <span
            aria-label={`검토 대기 ${pending}개`}
            className="bg-danger absolute -top-1 left-[calc(50%+4px)] flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-[5px] text-[10px] leading-none font-bold text-white"
          >
            {pending}
          </span>
        )}
      </>
    )
  }

  return (
    <nav
      aria-label="메인 메뉴"
      className="border-border z-20 flex w-full shrink-0 border bg-white pt-2.5 pb-[max(26px,env(safe-area-inset-bottom))]"
    >
      {navItems.map((item) =>
        item.to && (item.id !== 'meet' || meetOk) ? (
          <NavLink
            key={item.id}
            to={{ pathname: item.to, search: admin ? '' : location.search }}
            end={item.end ?? true}
            className="focus-visible:outline-accent relative flex min-w-0 flex-1 flex-col items-center gap-[3px] rounded focus-visible:outline-2"
          >
            {({ isActive }) => content(item, isActive)}
          </NavLink>
        ) : (
          <button
            key={item.id}
            type="button"
            disabled
            title="준비 중인 메뉴입니다"
            className="flex min-w-0 flex-1 flex-col items-center gap-[3px]"
          >
            {content(item, false)}
          </button>
        ),
      )}
    </nav>
  )
}
