import appIcon from '@/assets/home/app-icon.png'
import logo from '@/assets/home/logo.svg'
import type { HomeData, HomeUser } from '@/features/home/types'

export function HomeHeader({
  user,
  project,
  showNextSession = true,
}: {
  user: HomeUser
  project?: HomeData['project']
  showNextSession?: boolean
}) {
  return (
    <>
      <header className="flex w-full items-center gap-2">
        <img src={appIcon} width={30} height={30} alt="" />
        <h1>
          <img src={logo} width={58} height={35} alt="멋사수첩" />
        </h1>
        <button
          type="button"
          disabled
          title="프로필 준비 중"
          aria-label={`${user.initial} 프로필`}
          className="bg-card shadow-card ml-auto flex size-9 shrink-0 items-center justify-center rounded-2xl text-[13px] leading-[16px] font-bold"
        >
          {user.initial}
        </button>
      </header>
      <div className="flex flex-wrap items-center gap-1.5 text-[12px] leading-[14px] font-bold">
        <span className="border-border text-muted rounded-full border bg-white px-3 py-[5px]">
          {user.cohortLabel}
        </span>
        {user.part ? (
          <>
            <span className="bg-accent-soft text-accent-deep rounded-full px-3 py-[5px]">
              {user.part}
            </span>
            {user.team && (
              <span className="border-border text-muted rounded-full border bg-white px-3 py-[5px]">
                {user.team}
              </span>
            )}
          </>
        ) : (
          <span className="border-border text-muted rounded-full border bg-white px-3 py-[5px]">
            {user.assignmentLabel}
          </span>
        )}
      </div>
      {project && (
        <>
          <section aria-label="프로젝트 진행 상황" className="flex items-end gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-muted text-[13px] leading-[16px] font-medium">
                {project.dateLabel}
              </p>
              <h2 className="mt-0.5 text-[28px] leading-[34px] font-bold">
                프로젝트 {project.week}주차
              </h2>
            </div>
            <div className="bg-danger flex shrink-0 flex-col items-center rounded-[18px] px-3.5 py-2 font-bold text-white">
              <span className="text-[22px] leading-[26px]">D-{project.daysUntilPresentation}</span>
              <span className="text-[11px] leading-[13px]">{project.presentationLabel}</span>
            </div>
          </section>
          {showNextSession && (
            <p className="text-muted text-[12px] leading-[14px]">{project.nextSession}</p>
          )}
        </>
      )}
    </>
  )
}
