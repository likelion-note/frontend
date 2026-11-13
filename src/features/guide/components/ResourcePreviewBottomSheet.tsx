import { useQuery } from '@tanstack/react-query'
import { Fragment, type ReactNode } from 'react'

import closeIcon from '@/assets/meeting/close.svg'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { getGuideResourceById } from '@/features/guide/api'

/** 자료 목록에서 선택할 때도 같은 시트를 유지하여 중첩 모달과 배경 잠금 충돌을 피합니다. */
export function ResourcePreviewBottomSheet({
  open,
  onClose,
  resourceId,
  resourceTitle,
  children,
}: {
  open: boolean
  onClose: () => void
  resourceId: string | null
  resourceTitle?: string
  children?: ReactNode
}) {
  const resource = useQuery({
    queryKey: ['guide', 'resource', resourceId],
    queryFn: () => getGuideResourceById(resourceId!),
    enabled: open && !!resourceId,
  })
  const title = resourceId
    ? (resource.data?.title ?? resourceTitle ?? '자료 보기')
    : '지난 기수 기획서'
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={title}
      motion
      slideFromBottom
      slideDistance={16}
      animationDuration={180}
      dragOptions={{ threshold: 100, velocity: 0.65, fromContent: true }}
      closeIcon={<img src={closeIcon} width={22} height={22} alt="" />}
      titleClassName="text-[19px] leading-[23px]"
      handleClassName="h-[5px] bg-[#f1e6da] rounded-[3px]"
      overlayClassName="bg-[rgba(59,38,20,0.45)]"
      className="rounded-t-[26px] pt-2.5 pb-[max(30px,env(safe-area-inset-bottom))]"
    >
      {!resourceId ? (
        children
      ) : resource.isPending ? (
        <p role="status" className="text-muted text-[12px] leading-[16px]">
          자료를 불러오고 있어요.
        </p>
      ) : resource.isError ? (
        <div role="alert">
          <p className="text-[13px] leading-[17px]">자료를 불러오지 못했어요.</p>
          <button
            type="button"
            className="text-accent-deep mt-2 text-[13px] underline"
            onClick={() => void resource.refetch()}
          >
            다시 시도
          </button>
        </div>
      ) : !resource.data ? (
        <p className="text-muted text-[13px] leading-[17px]">자료를 찾을 수 없어요.</p>
      ) : (
        <>
          <p className="text-muted text-[12px] leading-[14px] [overflow-wrap:anywhere]">
            {resource.data.previewDescription ?? resource.data.description}
          </p>
          <Card as="section" aria-label="자료 미리보기" className="flex flex-col gap-2.5 py-5">
            <h3 className="text-[16px] leading-[19px] font-bold [overflow-wrap:anywhere]">
              {resource.data.previewTitle ?? resource.data.title}
            </h3>
            {resource.data.previewItems?.length ? (
              resource.data.previewItems.map((item, index) => (
                <Fragment key={`${resourceId}-${index}`}>
                  <p className="text-ink-2 text-[13px] leading-[16px] [overflow-wrap:anywhere] whitespace-pre-wrap">
                    {index + 1}. {item}
                  </p>
                  <div
                    aria-hidden="true"
                    className="h-1.5 w-[220px] max-w-full rounded-[3px] bg-[#f1e6da]"
                  />
                </Fragment>
              ))
            ) : (
              <p className="text-muted text-[13px] leading-[17px]">
                등록된 미리보기 항목이 없어요.
              </p>
            )}
          </Card>
        </>
      )}
      <Button variant="ghost" onClick={onClose} className="h-[46px] bg-white leading-[19px]">
        닫기
      </Button>
    </BottomSheet>
  )
}
