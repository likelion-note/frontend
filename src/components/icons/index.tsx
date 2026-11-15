import type { SVGProps } from 'react'

/**
 * 선 아이콘. 피그마 에셋의 경로를 그대로 쓰고 색만 currentColor 로 받아요.
 * 탭 아이콘은 켜짐(2px) · 꺼짐(1.8px) 굵기가 달라서 strokeWidth 를 받아요.
 */
type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function base(size: number, viewBox: number, props: IconProps) {
  const { size: _size, ...rest } = props
  void _size
  return {
    width: size,
    height: size,
    viewBox: `0 0 ${viewBox} ${viewBox}`,
    fill: 'none',
    'aria-hidden': true,
    ...rest,
  }
}

const stroke = (width: number) => ({
  stroke: 'currentColor',
  strokeWidth: width,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
})

export function BackIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg {...base(size, 24, props)} className={props.className ?? 'text-ink'}>
      <path d="M15 5L8 12L15 19" {...stroke(2.2)} />
    </svg>
  )
}

export function CloseIcon({ size = 22, ...props }: IconProps) {
  const s = size === 18 ? 4.5 : 5.5
  const c = size === 18 ? 9 : 11
  const e = size === 18 ? 13.5 : 16.5
  return (
    <svg {...base(size, size === 18 ? 18 : 22, props)} className={props.className ?? 'text-muted'}>
      <path
        d={`M${s} ${s}L${c} ${c}M${c} ${c}L${e} ${e}M${c} ${c}L${e} ${s}M${c} ${c}L${s} ${e}`}
        {...stroke(1.9)}
      />
    </svg>
  )
}

export function ChevronIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size, 18, props)} className={props.className ?? 'text-muted'}>
      <path d="M6.75 3.75L12 9L6.75 14.25" {...stroke(1.9)} />
    </svg>
  )
}

export function CopyIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base(size, 16, props)} className={props.className ?? 'text-accent-deep'}>
      <path
        d="M6.66667 5.33333H12C12.7364 5.33333 13.3333 5.93029 13.3333 6.66667V12C13.3333 12.7364 12.7364 13.3333 12 13.3333H6.66667C5.93029 13.3333 5.33333 12.7364 5.33333 12V6.66667C5.33333 5.93029 5.93029 5.33333 6.66667 5.33333Z"
        {...stroke(2)}
      />
      <path
        d="M10.6667 5.33333V3.33333C10.6667 3.15652 10.5964 2.98695 10.4714 2.86193C10.3464 2.7369 10.1768 2.66667 10 2.66667H3.33333C3.15652 2.66667 2.98695 2.7369 2.86193 2.86193C2.7369 2.98695 2.66667 3.15652 2.66667 3.33333V10C2.66667 10.1768 2.7369 10.3464 2.86193 10.4714C2.98695 10.5964 3.15652 10.6667 3.33333 10.6667H5.33333"
        {...stroke(2)}
      />
    </svg>
  )
}

/** 물음표 (막혔던 것). 채움 색이 있어서 고정 색으로 그려요 */
export function QuestionIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg {...base(size, 20, props)}>
      <path
        d="M10 17.6667C14.2342 17.6667 17.6667 14.2342 17.6667 10C17.6667 5.76582 14.2342 2.33333 10 2.33333C5.76582 2.33333 2.33333 5.76582 2.33333 10C2.33333 14.2342 5.76582 17.6667 10 17.6667Z"
        fill="#FFF1E0"
        stroke="#E9963F"
        strokeWidth={2}
      />
      <path
        d="M7.83333 7.83333C7.83056 7.43171 7.93534 7.03667 8.13679 6.68922C8.33824 6.34177 8.62902 6.05457 8.97895 5.85745C9.32887 5.66033 9.72518 5.56046 10.1267 5.56821C10.5283 5.57597 10.9204 5.69107 11.2625 5.90156C11.6045 6.11206 11.884 6.41027 12.0719 6.76524C12.2598 7.12021 12.3492 7.51901 12.3309 7.92022C12.3127 8.32143 12.1873 8.71044 11.9679 9.04685C11.7485 9.38326 11.4431 9.65482 11.0833 9.83333C10.4167 10.1667 10 10.6667 10 11.3333V11.75"
        stroke="#E08533"
        strokeWidth={2.1}
        strokeLinecap="round"
      />
      <path
        d="M10 15.2083C10.5753 15.2083 11.0417 14.742 11.0417 14.1667C11.0417 13.5914 10.5753 13.125 10 13.125C9.4247 13.125 8.95833 13.5914 8.95833 14.1667C8.95833 14.742 9.4247 15.2083 10 15.2083Z"
        fill="#E08533"
      />
    </svg>
  )
}

/* ---------- 하단 탭 아이콘 ---------- */

type TabIconProps = IconProps & { active?: boolean }

const tabStroke = (active: boolean | undefined) => stroke(active ? 2 : 1.8)

export function ReviewTabIcon({ size = 24, active, ...props }: TabIconProps) {
  return (
    <svg {...base(size, 24, props)}>
      <path d="M6 3H15L19 7V21H6V3Z" {...tabStroke(active)} />
      <path d="M9.5 13L11.5 15L15.5 10.5" {...tabStroke(active)} />
    </svg>
  )
}

export function MemberTabIcon({ size = 24, active, ...props }: TabIconProps) {
  return (
    <svg {...base(size, 24, props)}>
      <path
        d="M12.2 8.5C12.2 10.2673 10.7673 11.7 9 11.7C7.23269 11.7 5.8 10.2673 5.8 8.5C5.8 6.73269 7.23269 5.3 9 5.3C10.7673 5.3 12.2 6.73269 12.2 8.5Z"
        {...tabStroke(active)}
      />
      <path
        d="M3.5 19.5C4.1 16.1 6.3 14.3 9 14.3C11.7 14.3 13.9 16.1 14.5 19.5"
        {...tabStroke(active)}
      />
      <path
        d="M19.4 9.5C19.4 10.8255 18.3255 11.9 17 11.9C15.6745 11.9 14.6 10.8255 14.6 9.5C14.6 8.17452 15.6745 7.1 17 7.1C18.3255 7.1 19.4 8.17452 19.4 9.5Z"
        {...tabStroke(active)}
      />
      <path d="M16 14.6C18.4 14.4 20.1 16 20.6 19" {...tabStroke(active)} />
    </svg>
  )
}

export function OpsTabIcon({ size = 24, active, ...props }: TabIconProps) {
  return (
    <svg {...base(size, 24, props)}>
      <path
        d="M6.5 5H17.5C18.8807 5 20 6.11929 20 7.5V17.5C20 18.8807 18.8807 20 17.5 20H6.5C5.11929 20 4 18.8807 4 17.5V7.5C4 6.11929 5.11929 5 6.5 5Z"
        {...tabStroke(active)}
      />
      <path d="M4 10H20M9 3V7M15 3V7" {...tabStroke(active)} />
    </svg>
  )
}

export function NotesTabIcon({ size = 24, active, ...props }: TabIconProps) {
  return (
    <svg {...base(size, 24, props)}>
      <path d="M5 4H16L19 7V20H5V4Z" {...tabStroke(active)} />
      <path d="M8.5 10H15.5M8.5 13.5H15.5M8.5 17H12.5" {...tabStroke(active)} />
    </svg>
  )
}

export function RecordTabIcon({ size = 24, active, ...props }: TabIconProps) {
  return (
    <svg {...base(size, 24, props)}>
      <path d="M15 4L20 9L9 20H4V15L15 4Z" {...tabStroke(active)} />
      <path d="M13 6L18 11" {...tabStroke(active)} />
    </svg>
  )
}

/** 구글 로그인 버튼의 G 로고 (공식 4색) */
export function GoogleIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size, 18, props)}>
      <path
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  )
}
