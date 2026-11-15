import {
  JournalIllustration,
  type JournalIllustrationName,
} from '@/features/journal/components/JournalIllustration'

/** 쓴 일지 · 읽음 · 도움돼요 세 칸. 숫자는 공개된 내 일지가 노트 게시판에서 받은 값이에요. */
export function JournalStats({
  written,
  read,
  helpful,
}: {
  written: number
  read: number
  helpful: number
}) {
  const items: { label: string; value: number; illust: JournalIllustrationName }[] = [
    { label: '쓴 일지', value: written, illust: 'notepad' },
    { label: '읽음', value: read, illust: 'book' },
    { label: '도움돼요', value: helpful, illust: 'paw' },
  ]
  return (
    <dl className="flex w-full gap-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-card relative flex min-w-0 flex-1 flex-col gap-0.5 rounded-2xl px-3.5 py-3 drop-shadow-[0_6px_7px_rgba(115,77,38,0.08)]"
        >
          <dt className="text-muted text-[12px] leading-[17px] font-medium">{item.label}</dt>
          <dd className="text-[24px] leading-[29px] font-bold">{item.value}</dd>
          <JournalIllustration name={item.illust} size={30} className="absolute top-2 right-2.5" />
        </div>
      ))}
    </dl>
  )
}
