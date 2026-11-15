import { AdminPageHeader } from '@/features/admin/components/AdminHeader'
import { AdminContent } from '@/features/admin/components/AdminLayout'
import { ScheduleSection } from '@/features/admin/components/ScheduleSection'

/**
 * SCR-ADM-07 운영 탭. 일정을 관리해요.
 * 초대코드 관리(SCR-ADM-08)는 이번에 하지 않기로 해서 화면이 없어요. 가입할 때 코드 확인은 그대로 돼요.
 */
export function OpsPage() {
  return (
    <>
      <AdminPageHeader title="운영" illust="lion-calendar" illustSize={44} />
      <AdminContent>
        <ScheduleSection />
      </AdminContent>
    </>
  )
}
