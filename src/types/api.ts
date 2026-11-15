/**
 * 백엔드 공통 응답 형식.
 * 성공: { success: true, data: {...} }
 * 실패: { success: false, code: 'JOURNAL_NOT_FOUND', message: '...' }
 */
export type ApiSuccess<T> = {
  success: true
  data: T
}

export type ApiFailure = {
  success: false
  code: string
  message: string
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure
