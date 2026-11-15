/** 피그마 icon/mark와 같은 경로예요. 색은 currentColor를 따르고, 저장하면 안을 채워요. */
export function NoteBookmarkIcon({ filled, size = 22 }: { filled: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path
        d="M6.41667 3.66667H15.5833V18.3333L11 15.125L6.41667 18.3333V3.66667Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
