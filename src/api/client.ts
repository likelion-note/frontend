import { AUTH_EXPIRED_EVENT, clearAuth, getAccessToken } from '@/lib/authStorage'
import type { ApiResponse } from '@/types/api'

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''

/**
 * 목 모드: VITE_USE_MOCK 이 'false' 가 아니면 목이에요 (비어 있어도 목).
 * 배포(Vercel)에서는 'false' 로 두고 실제 백엔드를 써요.
 */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export class ApiError extends Error {
  readonly code: string
  readonly status: number

  constructor(code: string, message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  /** true 면 401 이어도 로그아웃 처리하지 않아요 (로그인 API 자체) */
  skipAuthRedirect?: boolean
}

/** 로그인 전에 부르는 API 는 401 이 와도 로그아웃 처리하지 않아요 */
const isAuthPath = (path: string) => path.startsWith('/api/auth/')

/** 토큰이 만료됐을 때: 세션을 지우고 온보딩으로 보내요 */
function handleUnauthorized() {
  clearAuth()
  window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT))
  if (!window.location.pathname.startsWith('/onboarding')) {
    window.location.replace('/onboarding')
  }
}

/**
 * fetch 래퍼. 공통 응답 형식을 풀어서 data 만 돌려주고, 실패는 ApiError 로 던져요.
 * 세션에 접근 토큰이 있으면 Authorization: Bearer 를 자동으로 붙여요.
 */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, skipAuthRedirect = false, ...rest } = options
  const token = getAccessToken()

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError('NETWORK_ERROR', '서버에 연결할 수 없어요. 잠시 후 다시 시도해 주세요', 0)
  }

  const json = (await response.json().catch(() => null)) as ApiResponse<T> | null

  if (!json) {
    throw new ApiError('INTERNAL_ERROR', '서버 응답을 읽을 수 없어요', response.status)
  }

  if (!json.success) {
    if (response.status === 401 && !skipAuthRedirect && !isAuthPath(path)) {
      handleUnauthorized()
    }
    throw new ApiError(json.code, json.message, response.status)
  }

  return json.data
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
}
