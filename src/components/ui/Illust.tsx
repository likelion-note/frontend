import bell from '@/assets/illust/bell.png'
import bulb from '@/assets/illust/bulb.png'
import calendar from '@/assets/illust/calendar.png'
import check from '@/assets/illust/check.png'
import clip from '@/assets/illust/clip.png'
import clock from '@/assets/illust/clock.png'
import eraser from '@/assets/illust/eraser.png'
import folder from '@/assets/illust/folder.png'
import gear from '@/assets/illust/gear.png'
import lionCalendar from '@/assets/illust/lion-calendar.png'
import lionCheck from '@/assets/illust/lion-check.png'
import lionGlasses from '@/assets/illust/lion-glasses.png'
import lionHappy from '@/assets/illust/lion-happy.png'
import lionMail from '@/assets/illust/lion-mail.png'
import lionThink from '@/assets/illust/lion-think.png'
import mag from '@/assets/illust/mag.png'
import people from '@/assets/illust/people.png'
import { cn } from '@/lib/cn'

const sources = {
  bell,
  bulb,
  calendar,
  check,
  clip,
  clock,
  eraser,
  folder,
  gear,
  'lion-calendar': lionCalendar,
  'lion-check': lionCheck,
  'lion-glasses': lionGlasses,
  'lion-happy': lionHappy,
  'lion-mail': lionMail,
  'lion-think': lionThink,
  mag,
  people,
} as const

export type IllustName = keyof typeof sources

type Props = {
  name: IllustName
  /** 한 변 길이(px). 피그마와 같은 값을 넣어요 */
  size: number
  className?: string
}

/** 색연필 일러스트. 흰 배경이 있어서 multiply 로 올려요 */
export function Illust({ name, size, className }: Props) {
  return (
    <img
      src={sources[name]}
      alt=""
      aria-hidden
      width={size}
      height={size}
      draggable={false}
      className={cn('shrink-0 object-contain mix-blend-multiply select-none', className)}
      style={{ width: size, height: size }}
    />
  )
}
