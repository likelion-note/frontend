import paw from '@/assets/home/paw.svg'
import sticky from '@/assets/home/sticky.svg'
import { HomeIllustration } from '@/features/home/components/HomeIllustration'
import type { HomeData } from '@/features/home/types'

export function StaffMessage({
  message,
  onToggleHelpful,
}: {
  message: HomeData['staffMessage']
  onToggleHelpful: () => void
}) {
  return (
    <section aria-label="운영진 한마디" className="pt-1">
      <div className="text-note-ink relative flex flex-col items-start gap-2 rounded bg-[#fce6b2] px-5 pt-5 pb-4 drop-shadow-[0_4px_4px_rgba(128,89,26,0.12)]">
        <span
          aria-hidden="true"
          className="absolute -top-[9px] left-1/2 h-5 w-[78px] -translate-x-1/2 bg-[rgba(245,201,168,0.7)]"
        />
        <h2 className="pr-14 text-[12px] leading-[14px] font-bold">
          운영진 한마디 · {message.week}주차
        </h2>
        <img src={sticky} width={136} height={56} alt={message.text} />
        <button
          type="button"
          aria-pressed={message.isHelpful}
          onClick={onToggleHelpful}
          className="border-note-ink focus-visible:outline-accent flex items-center gap-1 rounded-full border-[1.2px] px-3 py-[5px] text-[12px] leading-[14px] font-bold focus-visible:outline-2"
        >
          <img src={paw} width={13} height={13} alt="" />
          도움돼요 {message.helpfulCount}
        </button>
        <div className="absolute top-2 right-3">
          <HomeIllustration name="grad" size={58} />
        </div>
      </div>
    </section>
  )
}
