import { AdminLogoHeader } from '@/features/admin/components/AdminHeader'
import { AdminContent } from '@/features/admin/components/AdminLayout'

/** SCR-ADM-01 검토 홈. 내용은 검토 이슈에서 채워요 */
export function ReviewHomePage() {
  return (
    <>
      <AdminLogoHeader />
      <AdminContent>
        <p className="text-muted text-[13px]">검토 화면을 준비하고 있어요.</p>
      </AdminContent>
    </>
  )
}
