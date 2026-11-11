import { cn } from '@/lib/cn'

type Props = {
  checked: boolean
  onChange: (next: boolean) => void
  label?: string
  disabled?: boolean
}

/** 켜기·끄기 스위치 (46×28). 초대코드 켜기·끄기에 써요 */
export function Switch({ checked, onChange, label, disabled }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-7 w-[46px] shrink-0 rounded-full transition-colors',
        checked ? 'bg-accent' : 'bg-handle',
      )}
    >
      <span
        className={cn(
          'shadow-knob absolute top-[3px] size-[22px] rounded-full bg-white transition-[left]',
          checked ? 'left-[21px]' : 'left-[3px]',
        )}
      />
    </button>
  )
}
