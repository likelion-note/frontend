const GSI_SRC = 'https://accounts.google.com/gsi/client'

let loading: Promise<GoogleIdentity> | null = null

/** 구글 로그인 스크립트를 한 번만 불러와요 */
export function loadGoogleIdentity(): Promise<GoogleIdentity> {
  if (window.google?.accounts?.id) return Promise.resolve(window.google)
  if (loading) return loading

  loading = new Promise<GoogleIdentity>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GSI_SRC}"]`)
    const script = existing ?? document.createElement('script')
    const done = () => {
      if (window.google?.accounts?.id) resolve(window.google)
      else reject(new Error('구글 로그인 스크립트를 불러오지 못했어요'))
    }
    script.addEventListener('load', done, { once: true })
    script.addEventListener(
      'error',
      () => {
        loading = null
        reject(new Error('구글 로그인 스크립트를 불러오지 못했어요'))
      },
      { once: true },
    )
    if (!existing) {
      script.src = GSI_SRC
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }
  })
  return loading
}
