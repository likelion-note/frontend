import { useMutation, useQuery } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'

import { QuestionIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Illust } from '@/components/ui/Illust'
import { Pill } from '@/components/ui/Pill'
import { SectionTitle } from '@/components/ui/SectionTitle'
import * as api from '@/features/admin/api'
import { AdminBackHeader } from '@/features/admin/components/AdminHeader'
import { AdminContent } from '@/features/admin/components/AdminLayout'
import { RejectSheet } from '@/features/admin/components/RejectSheet'
import { useInvalidateAdmin } from '@/features/admin/hooks/useInvalidateAdmin'
import {
  scopeLabel,
  scopeTone,
  STATUS_LABEL,
  STATUS_TONE,
  submittedLabel,
} from '@/features/admin/labels'
import { journalQuery, meQuery, pendingJournalsQuery } from '@/features/admin/queries'
import { useToast } from '@/hooks/useToast'

/** SCR-ADM-02 일지 검토 */
export function ReviewDetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()
  const invalidate = useInvalidateAdmin()
  const [rejectOpen, setRejectOpen] = useState(false)

  const { data: me } = useQuery(meQuery())
  const { data: journal, isError } = useQuery({ ...journalQuery(id), enabled: Boolean(id) })
  const { data: pending } = useQuery(pendingJournalsQuery('oldest'))

  const approve = useMutation({
    mutationFn: () => api.approveJournal(id),
    onSuccess: async () => {
      await invalidate()
      toast('승인했어요. 노트 게시판에 올라가요')
      navigate('/admin/review', { replace: true })
    },
    onError: (e: Error) => toast(e.message),
  })

  const reject = useMutation({
    mutationFn: (reason: string) => api.rejectJournal(id, reason),
    onSuccess: async () => {
      await invalidate()
      setRejectOpen(false)
      toast('작성자에게 돌려보냈어요')
      navigate('/admin/review', { replace: true })
    },
    onError: (e: Error) => toast(e.message),
  })

  if (isError) return <Navigate to="/admin/review" replace />

  const cohort = me?.cohort ?? 14
  const position = pending ? pending.findIndex((j) => j.id === id) : -1
  const counter = pending && position >= 0 ? `${position + 1} / ${pending.length}` : undefined
  const busy = approve.isPending || reject.isPending

  return (
    <>
      <AdminBackHeader title="일지 검토" right={counter} backTo="/admin/review" />
      {journal && (
        <AdminContent>
          <div className="flex w-full flex-wrap items-center gap-1.5">
            <Pill tone={scopeTone(journal.scope)}>{scopeLabel(journal.scope, cohort)}</Pill>
            <Pill tone="beige">{submittedLabel(journal.submittedAt)}</Pill>
            <Pill tone="outline">{journal.category}</Pill>
            {journal.status !== 'PENDING' && (
              <Pill tone={STATUS_TONE[journal.status]}>{STATUS_LABEL[journal.status]}</Pill>
            )}
          </div>

          <SectionTitle title="승인하면 이렇게 올라가요" />
          <Card as="article" className="flex flex-col gap-1.5">
            <h2 className="text-ink text-[16px] leading-tight font-bold">{journal.title}</h2>
            <p className="text-muted text-[12px] leading-tight">{journal.anonymousLabel}</p>
            <p className="text-ink-2 line-clamp-1 text-[13px] leading-tight">{journal.preview}</p>
            <div className="flex w-full flex-wrap items-center gap-1.5 pt-1">
              {journal.tags.map((tag) => (
                <Pill key={tag} tone="rose">
                  #{tag}
                </Pill>
              ))}
            </div>
          </Card>

          <SectionTitle
            title="정리본 전체"
            action={
              journal.maskedCount > 0 ? (
                <span className="flex items-center gap-1">
                  <Illust name="eraser" size={20} />
                  <span className="text-accent-deep text-[12px] leading-none font-bold">
                    AI가 이름 {journal.maskedCount}곳을 가렸어요
                  </span>
                </span>
              ) : undefined
            }
          />
          <BodyBlock icon={<QuestionIcon />} label="막혔던 것" text={journal.body.stuck} />
          <BodyBlock
            icon={<Illust name="check" size={20} />}
            label="이렇게 넘겼어요"
            text={journal.body.overcame}
          />
          <BodyBlock
            icon={<Illust name="bulb" size={22} />}
            label="다시 한다면"
            text={journal.body.nextTime}
          />

          <div className="bg-note flex w-full items-start gap-2.5 rounded-2xl px-[18px] py-4">
            <Illust name="lion-glasses" size={40} />
            <div className="flex min-w-0 flex-1 flex-col gap-[3px] text-[13px] leading-normal">
              <p className="text-note-ink font-bold">검토 기준</p>
              <p className="text-ink-2">
                다른 사람이 특정되는 내용이 없는지, 다음 기수가 따라 할 수 있는 행동이 있는지만
                봐요. 문장은 고치지 않아요.
              </p>
            </div>
          </div>

          <div className="h-1" />

          {journal.status === 'PENDING' ? (
            <div className="flex w-full items-center gap-2">
              <Button
                variant="ghost"
                className="flex-1"
                disabled={busy}
                onClick={() => setRejectOpen(true)}
              >
                돌려보내기
              </Button>
              <Button className="flex-1" disabled={busy} onClick={() => approve.mutate()}>
                승인하고 올리기
              </Button>
            </div>
          ) : (
            <p className="text-muted text-center text-[13px]">이미 처리한 일지예요.</p>
          )}
        </AdminContent>
      )}

      <RejectSheet
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        onSubmit={(reason) => reject.mutate(reason)}
        submitting={reject.isPending}
      />
    </>
  )
}

function BodyBlock({ icon, label, text }: { icon: ReactNode; label: string; text: string }) {
  return (
    <section className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-1.5">
        {icon}
        <h3 className="text-muted text-[12px] leading-none font-bold">{label}</h3>
      </div>
      <p className="bg-highlight text-ink w-full rounded px-2.5 py-1.5 text-[15px] leading-[26px]">
        {text}
      </p>
    </section>
  )
}
