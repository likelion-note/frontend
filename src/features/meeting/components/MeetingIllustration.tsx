import sheet from '@/assets/home/notepad-sheet.png'
const crops = {
  clip: { width: '1123.58%', height: '749.06%', left: '-439.62%', top: '-629.25%' },
  headset: { width: '559.15%', height: '372.77%', left: '-365.73%', top: '-94.84%' },
  bulb: { width: '909.16%', height: '606.11%', left: '-112.6%', top: '-409.16%' },
  chat: { width: '968.29%', height: '645.53%', left: '-236.59%', top: '-441.87%' },
  think: { width: '569.86%', height: '379.9%', left: '-98.56%', top: '-1.44%' },
}
export function MeetingIllustration({ name, size }: { name: keyof typeof crops; size: number }) {
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
