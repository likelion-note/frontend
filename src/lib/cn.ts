import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Tailwind 클래스를 조건부로 합칠 때 써요. 충돌하는 클래스는 뒤쪽이 이겨요. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
