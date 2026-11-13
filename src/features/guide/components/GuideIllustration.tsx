import sheet from '@/assets/home/notepad-sheet.png'
const crops = {
  calendar: { width: '1017.95%', height: '678.63%', left: '-498.29%', top: '-464.96%' },
  folder: { width: '923.26%', height: '615.5%', left: '-445.74%', top: '-509.69%' },
}
export function GuideIllustration({ name, size }: { name: keyof typeof crops; size: number }) {
  return (
    <span
      aria-hidden="true"
      className="relative block shrink-0 overflow-hidden mix-blend-multiply"
      style={{ width: size, height: size }}
    >
      <img
        src={sheet}
        alt=""
        draggable={false}
        className="pointer-events-none absolute max-w-none"
        style={crops[name]}
      />
    </span>
  )
}
