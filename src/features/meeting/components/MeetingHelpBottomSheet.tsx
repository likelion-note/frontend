import { useQuery } from '@tanstack/react-query'
import closeIcon from '@/assets/meeting/close.svg'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { Button } from '@/components/ui/Button'
import { getPreviousTeamTips } from '@/features/meeting/api'
import { MeetingIllustration } from '@/features/meeting/components/MeetingIllustration'
import { PreviousTeamTipCard } from '@/features/meeting/components/PreviousTeamTipCard'
import { helpSituations } from '@/features/meeting/mock/data'
import type { SituationId } from '@/features/meeting/types'
export function MeetingHelpBottomSheet({
  open,
  situationId,
  onClose,
}: {
  open: boolean
  situationId: SituationId
  onClose: () => void
}) {
  const situation = helpSituations.find((item) => item.id === situationId)!
  const tips = useQuery({
    queryKey: ['meeting', 'previous-team-tips', situationId],
    queryFn: () => getPreviousTeamTips(situationId),
    enabled: open,
  })
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={situation.title}
      motion
      headerIcon={<MeetingIllustration name="think" size={40} />}
      closeIcon={<img src={closeIcon} width={22} height={22} alt="" />}
      titleClassName="text-[19px] leading-[23px]"
      handleClassName="h-[5px] bg-[#f1e6da] rounded-[3px]"
      overlayClassName="bg-[rgba(59,38,20,0.45)]"
      className="rounded-t-[26px] pt-2.5 pb-[max(30px,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center">
        <span className="bg-accent-soft text-accent-deep inline-block rounded-full px-3 py-[5px] text-[12px] leading-[14px] font-bold">
          {situation.source}
        </span>
      </div>
      <ol className="flex flex-col gap-2.5">
        {situation.steps.map((step, index) => (
          <li key={step} className="flex items-start gap-2.5">
            <span className="bg-accent flex size-6 shrink-0 items-center justify-center rounded-xl text-[12px] leading-[14px] font-bold text-white">
              {index + 1}
            </span>
            <span className="min-w-0 flex-1 text-[15px] leading-[18px] font-medium tracking-[-0.05px]">
              {step}
            </span>
          </li>
        ))}
      </ol>
      <h3 className="pt-2 text-[17px] leading-[20px] font-bold">
        <span className="marker-underline">지난 기수는 이렇게 했어요</span>
      </h3>
      {tips.isPending ? (
        <p role="status" className="text-muted text-[13px]">
          사례를 불러오고 있어요.
        </p>
      ) : tips.isError ? (
        <div role="alert" className="text-[13px]">
          <p>사례를 불러오지 못했어요.</p>
          <button
            type="button"
            className="text-accent-deep mt-2 underline"
            onClick={() => void tips.refetch()}
          >
            다시 시도
          </button>
        </div>
      ) : tips.data.length === 0 ? (
        <p className="text-muted text-[13px]">아직 등록된 사례가 없어요.</p>
      ) : (
        tips.data.map((tip) => <PreviousTeamTipCard key={tip.id} tip={tip} />)
      )}
      <Button variant="ghost" onClick={onClose} className="h-[46px] bg-white leading-[19px]">
        닫기
      </Button>
    </BottomSheet>
  )
}
