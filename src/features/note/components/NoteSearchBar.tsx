import { useId } from 'react'

import clearIcon from '@/assets/note/clear.svg'
import searchIcon from '@/assets/note/search.svg'

/** 둥근 검색칸. 글자가 있으면 오른쪽에 지우기 버튼이 나와요. */
export function NoteSearchBar({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const id = useId()
  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault()
        // 모바일 키보드의 검색 버튼은 키보드만 내려요.
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
      }}
      className="border-border focus-within:border-accent flex h-12 w-full items-center gap-2.5 rounded-full border bg-white pr-3.5 pl-4 transition-colors"
    >
      <label htmlFor={id} className="shrink-0">
        <img src={searchIcon} width={20} height={20} alt="" />
        <span className="sr-only">노트 검색</span>
      </label>
      <input
        id={id}
        type="search"
        enterKeyHint="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="제목·내용으로 찾기, #태그도 돼요"
        className="text-ink placeholder:text-icon-muted min-w-0 flex-1 bg-transparent text-[14px] leading-[20px] outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          aria-label="검색어 지우기"
          onClick={() => onChange('')}
          className="focus-visible:outline-accent flex size-[22px] shrink-0 items-center justify-center rounded-full bg-[#dcc9b2] focus-visible:outline-2"
        >
          <img src={clearIcon} width={12} height={12} alt="" />
        </button>
      )}
    </form>
  )
}
