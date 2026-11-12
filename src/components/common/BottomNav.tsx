import { NavLink } from 'react-router'

import homeIcon from '@/assets/home/nav-home.svg'
import meetIcon from '@/assets/home/nav-meet.svg'
import notesIcon from '@/assets/home/nav-notes.svg'
import recordIcon from '@/assets/home/nav-record.svg'
import { cn } from '@/lib/cn'

export interface BottomNavItem {
  id: string
  label: string
  icon: string
  activeIcon?: string
  /** 목적지 화면 구현 후 경로를 지정해요. 없으면 비활성화해요. */
  to?: string
}

const memberNavItems: readonly BottomNavItem[] = [
  { id: 'home', label: '홈', icon: homeIcon, to: '/home' },
  { id: 'meet', label: '회의', icon: meetIcon },
  { id: 'notes', label: '노트', icon: notesIcon },
  { id: 'record', label: '내 기록', icon: recordIcon },
]

export function BottomNav({ items = memberNavItems }: { items?: readonly BottomNavItem[] }) {
  const content = (item: BottomNavItem, active: boolean) => (
    <>
      <img
        src={active ? (item.activeIcon ?? item.icon) : item.icon}
        width={24}
        height={24}
        alt=""
      />
      <span
        className={cn(
          'text-[11px] leading-[13px]',
          active ? 'text-accent font-bold' : 'text-muted font-medium',
        )}
      >
        {item.label}
      </span>
    </>
  )

  return (
    <nav
      aria-label="메인 메뉴"
      className="border-border z-20 flex w-full shrink-0 border bg-white pt-2.5 pb-[max(26px,env(safe-area-inset-bottom))]"
    >
      {items.map((item) =>
        item.to ? (
          <NavLink
            key={item.id}
            to={item.to}
            end
            className="focus-visible:outline-accent flex min-w-0 flex-1 flex-col items-center gap-[3px] rounded focus-visible:outline-2"
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
