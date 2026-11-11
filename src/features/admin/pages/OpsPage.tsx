import { useNavigate, useParams } from 'react-router'

import { Segment } from '@/components/ui/Segment'
import { AdminPageHeader } from '@/features/admin/components/AdminHeader'
import { AdminContent } from '@/features/admin/components/AdminLayout'
import { InviteCodeSection } from '@/features/admin/components/InviteCodeSection'
import { ScheduleSection } from '@/features/admin/components/ScheduleSection'

export type OpsTab = 'schedule' | 'invite-codes'

const TABS: { value: OpsTab; label: string }[] = [
  { value: 'schedule', label: '일정' },
  { value: 'invite-codes', label: '초대코드' },
]

/** SCR-ADM-07 · 08 운영 탭. 일정 / 초대코드 두 칸 */
export function OpsPage() {
  const { tab = 'schedule' } = useParams<{ tab: OpsTab }>()
  const navigate = useNavigate()
  const isSchedule = tab === 'schedule'

  return (
    <>
      <AdminPageHeader
        title="운영"
        illust={isSchedule ? 'lion-calendar' : 'lion-mail'}
        illustSize={isSchedule ? 44 : 42}
      />
      <AdminContent>
        <Segment
          options={TABS}
          value={tab}
          onChange={(next) => navigate(`/admin/ops/${next}`, { replace: true })}
        />
        {isSchedule ? <ScheduleSection /> : <InviteCodeSection />}
      </AdminContent>
    </>
  )
}
