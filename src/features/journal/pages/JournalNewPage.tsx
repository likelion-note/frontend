import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'

import { ScreenContent } from '@/components/layout/Screen'
import { createJournalDraft } from '@/features/journal/api'
import { useJournalCache, useJournalContext } from '@/features/journal/useJournals'

/**
 * 새 일지. 빈 일지를 하나 만들고 바로 그 id의 쓰기 화면으로 바꿔요.
 * 그래서 쓰는 도중에 나가도 내 기록에 '작성 중'으로 남아요. `?import=week`는 그대로 넘겨요.
 */
export function JournalNewPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const context = useJournalContext()
  const cache = useJournalCache()
  const started = useRef(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 배정 정보(내 파트)를 불러온 뒤에 만들어요. 개발 모드에서 효과가 두 번 돌아도 하나만 만들어요.
    if (!context.ready || started.current) return
    started.current = true
    createJournalDraft({
      cohort: context.cohort,
      projectId: null,
      part: context.part,
    })
      .then((draft) => {
        cache.put(draft)
        navigate(`/me/journal/${draft.id}/edit${location.search}`, { replace: true })
      })
      .catch((reason: unknown) =>
        setError(reason instanceof Error ? reason.message : '새 일지를 만들지 못했어요.'),
      )
  }, [cache, context.ready, context.cohort, context.part, location.search, navigate])

  return (
    <ScreenContent>
      {error ? (
        <div role="alert" className="text-[13px]">
          <p>{error}</p>
          <Link to="/me" className="text-accent-deep mt-2 inline-block underline">
            내 기록으로
          </Link>
        </div>
      ) : (
        <p role="status" className="text-muted text-[13px]">
          새 일지를 펼치고 있어요.
        </p>
      )}
    </ScreenContent>
  )
}
