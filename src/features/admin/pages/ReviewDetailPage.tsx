import { AdminBackHeader } from '@/features/admin/components/AdminHeader'
import { AdminContent } from '@/features/admin/components/AdminLayout'

/** SCR-ADM-02 일지 검토. 내용은 검토 이슈에서 채워요 */
export function ReviewDetailPage() {
  return (
    <>
      <AdminBackHeader title="일지 검토" backTo="/admin/review" />
      <AdminContent>
        <p className="text-muted text-[13px]">일지 검토 화면을 준비하고 있어요.</p>
      </AdminContent>
    </>
  )
}
