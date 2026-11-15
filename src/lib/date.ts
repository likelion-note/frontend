const DAY_MS = 24 * 60 * 60 * 1000
const WEEKDAYS = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']

/** 'YYYY-MM-DD' 를 로컬 자정 Date 로 */
export function parseDate(date: string): Date {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** from → to 까지 며칠 남았는지 (같은 날이면 0) */
export function daysBetween(from: string, to: string): number {
  return Math.round((parseDate(to).getTime() - parseDate(from).getTime()) / DAY_MS)
}

/** '10/27' */
export function formatMonthDay(date: string): string {
  const d = parseDate(date)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

/** '월요일' */
export function formatWeekday(date: string): string {
  return WEEKDAYS[parseDate(date).getDay()]
}

/** 'D-12' · 'D-day' · 'D+3' */
export function formatDday(days: number): string {
  if (days === 0) return 'D-day'
  return days > 0 ? `D-${days}` : `D+${-days}`
}
