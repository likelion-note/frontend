import { useContext } from 'react'

import { ToastContext } from '@/components/ui/toast-context'

/** 짧은 알림 띄우기. 예) const toast = useToast(); toast('승인했어요') */
export function useToast() {
  const show = useContext(ToastContext)
  if (!show) throw new Error('useToast 는 ToastProvider 안에서만 쓸 수 있어요')
  return show
}
