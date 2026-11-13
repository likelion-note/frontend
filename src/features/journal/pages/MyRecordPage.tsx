import { useSearchParams } from 'react-router'

import grid from '@/assets/journal/grid-bg.svg'
import { BottomNav } from '@/components/common/BottomNav'
import { ScreenContent } from '@/components/layout/Screen'
import { Segment } from '@/components/ui/Segment'
import { JournalIllustration } from '@/features/journal/components/JournalIllustration'
import { JournalTab } from '@/features/journal/components/JournalTab'
import { PortfolioTab } from '@/features/journal/components/PortfolioTab'

type Tab = 'journal' | 'portfolio'
const tabs: { value: Tab; label: string }[] = [
  { value: 'journal', label: '성장일지' },
  { value: 'portfolio', label: '포트폴리오' },
]

/**
 * 내 기록 (SCR-JOUR-04 · SCR-PORT-01). 탭은 `?tab=portfolio` 쿼리로 기억해서
 * 요약 결과나 일지 상세에서 돌아와도 보던 탭이 열려요. 하단 탭의 '내 기록'은 둘 다 켜져요.
 */
export function MyRecordPage() {
  const [params, setParams] = useSearchParams()
  const tab: Tab = params.get('tab') === 'portfolio' ? 'portfolio' : 'journal'

  function select(next: Tab) {
    const search = new URLSearchParams(params)
    if (next === 'portfolio') search.set('tab', 'portfolio')
    else search.delete('tab')
    setParams(search, { replace: true })
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* 탭 화면 헤더. 노트 게시판 · 회의 도우미와 같은 모양이에요. */}
      <header className="border-header-line bg-paper flex h-[52px] shrink-0 items-center gap-1.5 border-b px-5">
        <h1 className="min-w-0 flex-1 text-[24px] leading-[29px] font-bold">
          <span className="marker-underline-lg">내 기록</span>
        </h1>
        <JournalIllustration
          name={tab === 'journal' ? 'write' : 'laptop'}
          size={52}
          className="-mr-1"
        />
      </header>
      <ScreenContent
        className="bg-paper [background-size:390px_auto] [background-position:top_center] [background-repeat:repeat-y] pt-2"
        style={{ backgroundImage: `url(${grid})` }}
      >
        <Segment id="my-record" label="내 기록" options={tabs} value={tab} onChange={select} />
        <div
          id="my-record-panel"
          role="tabpanel"
          aria-labelledby={`my-record-${tab}`}
          className="flex min-h-0 flex-1 flex-col gap-3.5 [&>*]:shrink-0"
        >
          {tab === 'journal' ? <JournalTab /> : <PortfolioTab />}
        </div>
      </ScreenContent>
      <BottomNav />
    </div>
  )
}
