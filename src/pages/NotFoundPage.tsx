import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-5">
      <p className="text-headline font-semibold">페이지를 찾을 수 없어요</p>
      <Link to="/" className="text-body2 text-neutral-500 underline">
        처음으로
      </Link>
    </main>
  )
}
