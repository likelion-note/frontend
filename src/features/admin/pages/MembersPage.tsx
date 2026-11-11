import { AdminPageHeader } from '@/features/admin/components/AdminHeader'
import { AdminContent } from '@/features/admin/components/AdminLayout'

/** SCR-ADM-04 멤버·프로젝트. 내용은 멤버 이슈에서 채워요 */
export function MembersPage() {
  return (
    <>
      <AdminPageHeader title="멤버" illust="people" />
      <AdminContent>
        <p className="text-muted text-[13px]">멤버 화면을 준비하고 있어요.</p>
      </AdminContent>
    </>
  )
}
