import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'

import appIcon from '@/assets/brand/app-icon.png'
import logo from '@/assets/brand/logo.svg'
import { BackIcon } from '@/components/icons'
import { Illust, type IllustName } from '@/components/ui/Illust'
import { Pill } from '@/components/ui/Pill'
import { meQuery } from '@/features/admin/queries'

/**
 * 검토 홈 맨 위 로고 줄: 앱 아이콘 · 손글씨 로고 · 운영진 뱃지 · 아바타.
 * 아기사자 홈처럼 본문 안에 넣어서 같이 스크롤해요.
 */
export function AdminLogoHeader() {
  const { data: me } = useQuery(meQuery())
  return (
    <header className="flex w-full items-center gap-2">
      <Link to="/admin/review" aria-label="홈으로" className="flex items-center gap-2">
        <img src={appIcon} alt="" width={30} height={30} className="size-[30px] shrink-0" />
        <img
          src={logo}
          alt="멋사수첩"
          width={58}
          height={35}
          className="h-[35px] w-[58px] shrink-0"
        />
      </Link>
      <Pill tone="orange" size="sm">
        운영진
      </Pill>
      <div className="flex-1" />
      <Link
        to="/profile"
        aria-label="프로필 설정"
        className="bg-card text-ink shadow-card flex size-9 shrink-0 items-center justify-center rounded-full text-[14px] font-bold active:brightness-95"
      >
        {me?.name.charAt(0)}
      </Link>
    </header>
  )
}

type PageHeaderProps = {
  title: string
  illust: IllustName
  illustSize?: number
}

/** 멤버 · 운영 탭 상단: 큰 제목 + 형광펜 밑줄 + 오른쪽 일러스트 */
export function AdminPageHeader({ title, illust, illustSize = 40 }: PageHeaderProps) {
  return (
    <header className="flex h-[58px] w-full items-center gap-1.5 px-5">
      <h1 className="text-ink flex-1 text-[24px] leading-tight font-bold">
        <span className="marker-underline-lg">{title}</span>
      </h1>
      <Illust name={illust} size={illustSize} />
    </header>
  )
}

type BackHeaderProps = {
  title: string
  right?: ReactNode
  /** 뒤로 갈 곳. 없으면 브라우저 뒤로 가기 */
  backTo?: string
}

/** 상세 화면 상단: 뒤로 가기 + 제목 + 오른쪽 글자 */
export function AdminBackHeader({ title, right, backTo }: BackHeaderProps) {
  const navigate = useNavigate()
  const goBack = () => {
    if (backTo) navigate(backTo)
    else if (window.history.length > 1) navigate(-1)
    else navigate('/admin/review')
  }
  return (
    <header className="border-header-line flex h-[52px] w-full items-center gap-1.5 border-b pr-5 pl-3">
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
