/** 아직 안 만든 탭의 자리표시 화면 */
export function ComingSoonPage({ title }: { title: string }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-2 px-5 py-10">
      <p className="text-ink text-[18px] font-bold">{title}</p>
      <p className="text-muted text-[13px]">준비 중이에요</p>
    </main>
  )
}
