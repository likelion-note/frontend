import { Link } from 'react-router'

import { Illust } from '@/components/ui/Illust'

/** 없는 주소로 들어왔을 때. '처음으로'는 로그인 상태에 맞는 첫 화면으로 보내요 */
export function NotFoundPage() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2.5 px-5 text-center">
      <Illust name="lion-think" size={112} />
      <h1 className="text-ink pt-2 text-[20px] leading-tight font-bold">페이지를 찾을 수 없어요</h1>
      <p className="text-muted text-[13px] leading-normal">주소가 바뀌었거나 없는 화면이에요.</p>
      <Link
        to="/"
        replace
        className="bg-accent-soft text-accent-deep mt-3 flex h-[46px] items-center justify-center rounded-full px-9 text-[16px] font-bold tracking-[-0.16px] active:brightness-95"
      >
        처음으로
      </Link>
    </main>
  )
}
