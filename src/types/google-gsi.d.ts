/** Google Identity Services (accounts.google.com/gsi/client) 중 우리가 쓰는 부분만 */
export {}

declare global {
  interface GsiCredentialResponse {
    credential: string
    select_by?: string
  }

  interface GsiButtonOptions {
    type?: 'standard' | 'icon'
    theme?: 'outline' | 'filled_blue' | 'filled_black'
    size?: 'large' | 'medium' | 'small'
    text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin'
    shape?: 'rectangular' | 'pill' | 'circle' | 'square'
    logo_alignment?: 'left' | 'center'
    width?: number
    locale?: string
  }

  interface GoogleIdentity {
    accounts: {
      id: {
        initialize(config: {
          client_id: string
          callback: (response: GsiCredentialResponse) => void
          ux_mode?: 'popup' | 'redirect'
          auto_select?: boolean
          cancel_on_tap_outside?: boolean
          itp_support?: boolean
        }): void
        renderButton(parent: HTMLElement, options: GsiButtonOptions): void
        prompt(): void
        cancel(): void
      }
    }
  }

  interface Window {
    google?: GoogleIdentity
  }
}
