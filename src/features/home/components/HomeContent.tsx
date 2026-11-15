import type { ReactNode } from 'react'

import beforeGrid from '@/assets/home/grid-before.svg'
import inactiveGrid from '@/assets/home/grid-inactive.svg'

/** 신규 홈도 기존 모바일 프레임 안에서 본문만 스크롤해요. */
export function HomeContent({
  children,
  mode,
}: {
  children: ReactNode
  mode: 'before-part-assignment' | 'project-inactive'
}) {
  return (
    <main
      aria-label="멋사수첩 홈"
      className="no-scrollbar bg-paper flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto overscroll-contain [background-size:390px_auto] [background-position:top_center] [background-repeat:repeat-y] px-5 pt-1 pb-7 [&>*]:shrink-0"
      style={{
        backgroundImage: `url(${mode === 'before-part-assignment' ? beforeGrid : inactiveGrid})`,
      }}
    >
      {children}
    </main>
  )
}
