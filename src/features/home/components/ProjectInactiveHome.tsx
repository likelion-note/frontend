import notesIcon from '@/assets/home/notes-inactive.svg'
import { HomeAction } from '@/features/home/components/HomeAction'
import { HomeContent } from '@/features/home/components/HomeContent'
import { HomeHeader } from '@/features/home/components/HomeHeader'
import type { InactiveHomeData } from '@/features/home/types'

export function ProjectInactiveHome({ data }: { data: InactiveHomeData }) {
  return (
    <HomeContent mode="project-inactive">
      <HomeHeader user={data.user} />
      <div aria-hidden="true" className="min-h-0 flex-1" />
      <div className="flex justify-center">
        <div className="bg-accent-soft flex size-20 items-center justify-center rounded-[40px]">
          <img src={notesIcon} width={36} height={36} alt="" />
        </div>
      </div>
      <h2 className="text-center text-[19px] leading-[23px] font-bold">{data.title}</h2>
      <p className="text-muted text-center text-[13px] leading-[16px]">{data.description}</p>
      <HomeAction
        action={data.action}
        className="bg-accent-soft text-accent-deep flex min-h-[46px] items-center justify-center rounded-full px-4 text-center text-[16px] leading-[19px] font-bold tracking-[-0.16px]"
      />
      <div aria-hidden="true" className="h-[180px]" />
    </HomeContent>
  )
}
