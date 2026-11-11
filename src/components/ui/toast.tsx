import { useCallback, useRef, useState, type ReactNode } from 'react'

import { ToastContext } from '@/components/ui/toast-context'

type ToastState = { id: number; message: string } | null

/** 화면 아래 짧은 알림. 저장·복사·승인 뒤에 한 줄 띄워요. 쓰는 쪽은 useToast() */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>(null)
  const timer = useRef<number | null>(null)

  const show = useCallback((message: string) => {
    if (timer.current) window.clearTimeout(timer.current)
    setToast({ id: Date.now(), message })
    timer.current = window.setTimeout(() => setToast(null), 2000)
  }, [])

  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-[104px] z-[60] flex justify-center">
          <div
            key={toast.id}
            role="status"
            className="animate-toast-in bg-ink shadow-card rounded-full px-4 py-2.5 text-[13px] font-medium text-white"
          >
            {toast.message}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  )
}
