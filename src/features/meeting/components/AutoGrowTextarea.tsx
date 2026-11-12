import { useLayoutEffect, useRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Props = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value'> & {
  value: string
  minHeight: number
}
export function AutoGrowTextarea({ value, minHeight, className, ...props }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null)
  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    let width = element.clientWidth
    function resize() {
      if (!element) return
      element.style.height = '0px'
      const style = getComputedStyle(element)
      const borders = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth)
      element.style.height = `${Math.max(minHeight, element.scrollHeight + borders)}px`
    }
    resize()
    const observer = new ResizeObserver(() => {
      if (element.clientWidth !== width) {
        width = element.clientWidth
        resize()
      }
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [value, minHeight])
  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      className={cn('block w-full resize-none overflow-hidden', className)}
      {...props}
    />
  )
}
