import { GuideResourceCard } from '@/features/guide/components/GuideResourceCard'
import { ResourcePreviewBottomSheet } from '@/features/guide/components/ResourcePreviewBottomSheet'
import type { GuideResource } from '@/features/guide/types'

export function GuideResourcesSheet({
  open,
  onClose,
  resources,
  pending,
  failed,
  onRetry,
  resourceId,
  resourceTitle,
  onSelect,
}: {
  open: boolean
  onClose: () => void
  resources: GuideResource[]
  pending: boolean
  failed: boolean
  onRetry: () => void
  resourceId: string | null
  resourceTitle?: string
  onSelect: (id: string) => void
}) {
  return (
    <ResourcePreviewBottomSheet
      open={open}
      onClose={onClose}
      resourceId={resourceId}
      resourceTitle={resourceTitle}
    >
      {pending ? (
        <p role="status">자료를 불러오고 있어요.</p>
      ) : failed ? (
        <div role="alert">
          <p>자료를 불러오지 못했어요.</p>
          <button type="button" className="text-accent-deep mt-2 underline" onClick={onRetry}>
            다시 시도
          </button>
        </div>
      ) : resources.length ? (
        resources.map((resource) => (
          <GuideResourceCard key={resource.id} resource={resource} onSelect={onSelect} />
        ))
      ) : (
        <p className="text-muted text-[13px]">아직 등록된 자료가 없어요.</p>
      )}
    </ResourcePreviewBottomSheet>
  )
}
