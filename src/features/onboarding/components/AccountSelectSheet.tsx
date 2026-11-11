import { BottomSheet } from '@/components/ui/BottomSheet'
import { Card } from '@/components/ui/Card'
import { mockAccounts, type MockAccount } from '@/features/onboarding/api'
import { cn } from '@/lib/cn'

type Props = {
  open: boolean
  onClose: () => void
  onSelect: (account: MockAccount) => void
  busy?: boolean
}

const STATUS_LABEL: Record<MockAccount['status'], string> = {
  new: '처음 로그인',
  member: '이미 가입함',
  admin: '이미 가입함 · 운영진',
}

/** 구글 계정 선택을 흉내 내는 시트. 실제 앱에서는 구글 로그인 화면이 떠요 */
export function AccountSelectSheet({ open, onClose, onSelect, busy = false }: Props) {
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="계정 선택"
      description={<span className="text-muted">실제 앱에서는 구글 로그인 화면이 떠요</span>}
    >
      {mockAccounts.map((account) => (
        <Card key={account.id} className="p-0">
          <button
            type="button"
            disabled={busy}
            onClick={() => onSelect(account)}
            className={cn(
              'flex w-full items-center gap-3 px-[18px] py-3.5 text-left active:brightness-[0.98]',
              busy && 'opacity-60',
            )}
          >
            <span className="bg-accent-soft text-accent-deep flex size-[38px] shrink-0 items-center justify-center rounded-full text-[14px] font-bold">
              {account.name.charAt(0)}
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-ink text-[15px] leading-tight font-bold">{account.name}</span>
              <span className="text-muted truncate text-[12px] leading-tight">
                {account.email} · {STATUS_LABEL[account.status]}
              </span>
            </span>
          </button>
        </Card>
      ))}
      <div className="h-1" />
    </BottomSheet>
  )
}
