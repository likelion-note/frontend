import sheet from '@/assets/home/notepad-sheet.png'
import grad from '@/assets/home/grad-sheet.png'

/** Figma 원본 스프라이트의 위치와 비율을 그대로 유지해요. */
export function HomeIllustration({
  name,
  size,
}: {
  name: 'notepad' | 'paw' | 'grad'
  size: number
}) {
  const crops = {
    notepad: { width: '882.22%', height: '588.15%', left: '-132.59%', top: '-303.33%' },
    paw: { width: '827.08%', height: '551.39%', left: '-19.44%', top: '-280.21%' },
    grad: { width: '1037.84%', height: '691.89%', left: '-384.46%', top: '-370.95%' },
  }
  return (
    <span
      aria-hidden="true"
      className="relative block shrink-0 overflow-hidden mix-blend-multiply"
      style={{ width: size, height: size }}
    >
      <img
        src={name === 'grad' ? grad : sheet}
        alt=""
        draggable={false}
        className="pointer-events-none absolute max-w-none"
        style={crops[name]}
      />
    </span>
  )
}
