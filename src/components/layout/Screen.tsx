import type { ReactNode } from 'react'
import { Outlet, useNavigate } from 'react-router'

import { BackIcon } from '@/components/icons'
import { cn } from '@/lib/cn'

/** 탭 없는 화면 틀. 헤더는 고정되고 ScreenContent 만 스크롤돼요 */
export function ScreenLayout() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <Outlet />
    </div>
  )
}

/** 화면 본문. 헤더 아래에서 이 영역만 스크롤돼요. 좌우 20px, 세로 간격 14px */
export function ScreenContent({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <main
      className={cn(
        'no-scrollbar flex min-h-0 w-full flex-1 flex-col gap-3.5 overflow-y-auto overscroll-contain px-5 pt-3 pb-7 [&>*]:shrink-0',
        className,
      )}
    >
      {children}
    </main>
  )
}

type BackHeaderProps = {
  title: string
  right?: ReactNode
  /** 뒤로 갈 곳. 없으면 브라우저 뒤로 가기 */
  backTo?: string
}

/** 뒤로 가기 + 제목 + 오른쪽 글자 */
export function BackHeader({ title, right, backTo }: BackHeaderProps) {
  const navigate = useNavigate()
  const goBack = () => {
    if (backTo) navigate(backTo)
    else if (window.history.length > 1) navigate(-1)
    else navigate('/')
  }
  return (
    <header className="border-header-line flex h-[52px] w-full shrink-0 items-center gap-1.5 border-b pr-5 pl-3">
      <button type="button" aria-label="뒤로" onClick={goBack} className="shrink-0">
        <BackIcon />
      </button>
      <h1 className="text-ink flex-1 text-[18px] leading-tight font-bold">
        <span className="marker-underline">{title}</span>
      </h1>
      {right && <div className="text-muted text-[13px] font-medium">{right}</div>}
    </header>
  )
}
