import grid from '@/assets/home/grid-bg.svg'
import { Card } from '@/components/ui/Card'
import { ArchiveSection } from '@/features/home/components/ArchiveSection'
import { HomeAction } from '@/features/home/components/HomeAction'
import { HomeHeader } from '@/features/home/components/HomeHeader'
import { HomeIllustration } from '@/features/home/components/HomeIllustration'
import { StaffMessage } from '@/features/home/components/StaffMessage'
import { TodoSection } from '@/features/home/components/TodoSection'
import type { HomeData } from '@/features/home/types'

export function ProjectActiveHome({
  data,
  onToggleTodo,
  onToggleHelpful,
}: {
  data: HomeData
  onToggleTodo: (id: string) => void
  onToggleHelpful: () => void
}) {
  return (
    <main
      aria-label="멋사수첩 홈"
      className="no-scrollbar bg-paper flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto overscroll-contain [background-size:390px_auto] [background-position:top_center] [background-repeat:repeat-y] px-5 pt-1 pb-7 [&>*]:shrink-0"
      style={{ backgroundImage: `url(${grid})` }}
    >
      <HomeHeader user={data.user} project={data.project} />
      {data.returnedJournal.count > 0 && (
        <section
          aria-label="돌려받은 일지"
          className="bg-rose-2 flex items-center gap-3 rounded-[20px] px-[18px] py-3.5"
        >
          <HomeIllustration name="notepad" size={30} />
          <div className="min-w-0 flex-1">
            <h2 className="text-[14px] leading-[17px] font-bold">
              돌려받은 일지 {data.returnedJournal.count}개
            </h2>
            <p className="text-ink-2 mt-0.5 text-[12px] leading-[14px]">
              {data.returnedJournal.description}
            </p>
          </div>
          <HomeAction
            action={data.returnedJournal.action}
            className="text-danger shrink-0 text-[13px] leading-[16px] font-bold"
          />
        </section>
      )}
      <TodoSection todos={data.todos} action={data.todosAction} onToggle={onToggleTodo} />
      <StaffMessage message={data.staffMessage} onToggleHelpful={onToggleHelpful} />
      <HomeAction
        action={data.journalAction}
        className="bg-accent flex min-h-[50px] items-center justify-center rounded-full px-4 text-center text-[18px] leading-[22px] font-bold tracking-[-0.18px] text-white"
      />
      <Card as="section" aria-label="내 노트 통계">
        <div className="flex items-center gap-2">
          <div className="bg-accent-soft flex size-10 shrink-0 items-center justify-center rounded-[14px]">
            <HomeIllustration name="paw" size={30} />
          </div>
          <div className="min-w-0">
            <p className="text-[14px] leading-[17px] font-bold">
              내 노트를 읽은 {data.noteStats.cohort}기 {data.noteStats.readCount}번 · 도움돼요{' '}
              {data.noteStats.helpfulCount}
            </p>
            <p className="text-muted mt-0.5 text-[12px] leading-[14px]">
              공개 중인 내 노트 {data.noteStats.publicCount}개
            </p>
          </div>
        </div>
      </Card>
      <ArchiveSection notes={data.archiveNotes} action={data.archiveAction} />
    </main>
  )
}
