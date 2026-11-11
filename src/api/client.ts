import type { ApiResponse } from '@/types/api'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
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
}

/**
 * fetch 래퍼. 공통 응답 형식을 풀어서 data 만 돌려주고, 실패는 ApiError 로 던져요.
 * 인증 헤더(JWT)는 로그인 기능이 붙을 때 여기에 추가해요.
 */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const json = (await response.json().catch(() => null)) as ApiResponse<T> | null

  if (!json) {
    throw new ApiError('INTERNAL_ERROR', '서버 응답을 읽을 수 없어요', response.status)
  }

  if (!json.success) {
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
