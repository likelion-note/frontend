import { useQuery } from '@tanstack/react-query'
import type { ComponentType } from 'react'
import { NavLink } from 'react-router'

import {
  MemberTabIcon,
  NotesTabIcon,
  OpsTabIcon,
  RecordTabIcon,
  ReviewTabIcon,
} from '@/components/icons'
import { summaryQuery } from '@/features/admin/queries'
import { cn } from '@/lib/cn'

type Tab = {
  to: string
  label: string
  Icon: ComponentType<{ active?: boolean; className?: string }>
}

const tabs: Tab[] = [
  { to: '/admin/review', label: '검토', Icon: ReviewTabIcon },
  { to: '/admin/members', label: '멤버', Icon: MemberTabIcon },
  { to: '/admin/ops', label: '운영', Icon: OpsTabIcon },
  { to: '/notes', label: '노트', Icon: NotesTabIcon },
  { to: '/me', label: '내 기록', Icon: RecordTabIcon },
]

/** 운영진 하단 탭. 검토 탭에는 대기 수 배지가 붙어요 */
export function AdminTabBar() {
  const { data: summary } = useQuery(summaryQuery())
  const pending = summary?.pendingCount ?? 0

  return (
    <nav
      aria-label="운영진 메뉴"
      className="border-tab-line bg-paper sticky bottom-0 z-20 flex w-full border-t pt-2.5 pb-[26px]"
    >
      {tabs.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className="relative flex min-w-0 flex-1 flex-col items-center gap-[3px]"
        >
          {({ isActive }) => (
            <>
              <Icon
                active={isActive}
                className={cn(isActive ? 'text-accent' : 'text-icon-muted')}
              />
              <span
                className={cn(
                  'text-[11px] leading-none',
                  isActive ? 'text-accent font-bold' : 'text-muted font-medium',
                )}
              >
                {label}
              </span>
              {to === '/admin/review' && pending > 0 && (
                <span className="bg-danger absolute -top-1 left-[calc(50%+4px)] flex size-[18px] items-center justify-center rounded-full px-[5px] text-[10px] leading-none font-bold text-white">
                  {pending}
                </span>
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
