import journalDot from '@/assets/home/journal-dot.svg'
import { Card } from '@/components/ui/Card'
import { ArchiveSection } from '@/features/home/components/ArchiveSection'
import { HomeAction } from '@/features/home/components/HomeAction'
import { HomeContent } from '@/features/home/components/HomeContent'
import { HomeHeader } from '@/features/home/components/HomeHeader'
import type { BeforePartHomeData } from '@/features/home/types'

export function BeforePartHome({ data }: { data: BeforePartHomeData }) {
  return (
    <HomeContent mode="before-part-assignment">
      <HomeHeader user={data.user} project={data.project} showNextSession={false} />
      <Card
        as="section"
        aria-labelledby="assignment-heading"
        className="flex flex-col items-center gap-2.5 py-7 text-center"
      >
        <h2
          id="assignment-heading"
          className="w-full text-[19px] leading-[23px] font-bold whitespace-pre-line"
        >
          {data.assignment.title}
        </h2>
        <p className="text-muted w-full text-[13px] leading-[16px]">
          {data.assignment.description}
        </p>
      </Card>
      <section
        aria-label={data.journal.action.label}
        className="bg-accent-soft relative flex items-center gap-3 rounded-[20px] px-[18px] py-3.5 active:brightness-95"
      >
        <img src={journalDot} width={8} height={8} alt="" className="shrink-0" />
        <div className="min-w-0 flex-1">
          <h2 className="text-[14px] leading-[17px] font-bold">
            <HomeAction
              action={data.journal.action}
              className="text-left before:absolute before:inset-0 before:rounded-[20px]"
            />
          </h2>
          <p className="text-ink-2 mt-0.5 text-[12px] leading-[14px]">{data.journal.description}</p>
        </div>
        <span
          aria-hidden="true"
          className="text-accent-deep shrink-0 text-[18px] leading-[22px] font-bold"
        >
          ›
        </span>
      </section>
      <ArchiveSection notes={data.archiveNotes} action={data.archiveAction} />
    </HomeContent>
  )
}
