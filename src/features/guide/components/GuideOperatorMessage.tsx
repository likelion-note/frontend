import { HomeIllustration } from '@/features/home/components/HomeIllustration'
import type { WeeklyGuide } from '@/features/guide/types'

export function GuideOperatorMessage({ message }: { message: WeeklyGuide['operatorMessage'] }) {
  return (
    <section aria-label="운영진 한마디" className="pt-1">
      <div className="text-note-ink relative flex flex-col items-start gap-2 rounded bg-[#fce6b2] px-5 pt-5 pb-4 drop-shadow-[0_4px_4px_rgba(128,89,26,0.12)]">
        <span
          aria-hidden="true"
          className="absolute -top-[9px] left-1/2 h-5 w-[78px] -translate-x-1/2 bg-[rgba(245,201,168,0.7)]"
        />
        <h2 className="pr-14 text-[12px] leading-[14px] font-bold">운영진 한마디</h2>
        {message.image ? (
          <img
            src={message.image.src}
            width={message.image.width}
            height={message.image.height}
            alt={message.text}
          />
        ) : (
          <p className="min-h-[56px] pr-[58px] text-[15px] leading-[24px] [overflow-wrap:anywhere] whitespace-pre-wrap">
            {message.text}
          </p>
        )}
        <div className="absolute top-2 right-3">
          <HomeIllustration name="grad" size={58} />
        </div>
      </div>
    </section>
  )
}
