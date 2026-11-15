import { useState } from 'react'
import { useNavigate } from 'react-router'

import { deleteJournal } from '@/features/journal/api'
import { journalTitle } from '@/features/journal/labels'
import type { MyJournal } from '@/features/journal/types'
import { useJournalCache } from '@/features/journal/useJournals'
import { useToast } from '@/hooks/useToast'

/**
 * '이 일지 지우기'. 작성 중이거나 돌려받은 일지에만 보여요.
 * 검토 중인 일지는 운영진이 보고 있고, 공개된 노트는 지울 수 없어요 (서버도 막아요).
 * 지우기 전에 한 번 물어보고, 지우면 내 기록으로 돌아가요.
 */
export function DeleteJournalButton({
  journal,
  onBeforeDelete,
}: {
  journal: MyJournal
  /** 지우기 직전에 불러요 (쓰기 화면이 자동 정리와 겹치지 않게 표시하는 용도) */
  onBeforeDelete?: () => void
}) {
  const navigate = useNavigate()
  const toast = useToast()
  const cache = useJournalCache()
  const [busy, setBusy] = useState(false)

  if (journal.status !== 'DRAFT' && journal.status !== 'REJECTED') return null

  async function remove() {
    if (busy) return
    const message = `"${journalTitle(journal)}" 일지를 지울까요?\n지운 일지는 되돌릴 수 없어요.`
    if (!window.confirm(message)) return
    setBusy(true)
    try {
      onBeforeDelete?.()
      await deleteJournal(journal.id)
      cache.remove(journal.id)
      toast('일지를 지웠어요.')
      navigate('/me', { replace: true })
    } catch (error) {
      toast(error instanceof Error ? error.message : '일지를 지우지 못했어요.')
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={() => void remove()}
      disabled={busy}
      className="text-muted relative self-center text-[13px] leading-[17px] font-medium underline underline-offset-4 before:absolute before:-inset-2 disabled:opacity-50"
    >
      이 일지 지우기
    </button>
  )
}
