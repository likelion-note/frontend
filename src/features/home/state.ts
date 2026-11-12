import type { HomeMode, HomeState } from '@/features/home/types'

/** 파트 배정 전 상태는 프로젝트 진행 여부보다 우선해요. */
export function resolveHomeMode(state: HomeState): HomeMode {
  if (!state.isPartAssigned) return 'before-part-assignment'
  return state.isProjectActive ? 'project-active' : 'project-inactive'
}

/** 호출부에서 개발 환경에만 적용해요. 잘못된 값은 기본 Mock 설정을 유지해요. */
export function readPreviewState(params: URLSearchParams, fallback: HomeState): HomeState {
  function readBoolean(key: string, value: boolean) {
    const parameter = params.get(key)
    return parameter === 'true' ? true : parameter === 'false' ? false : value
  }
  return {
    isPartAssigned: readBoolean('partAssigned', fallback.isPartAssigned),
    isProjectActive: readBoolean('projectActive', fallback.isProjectActive),
  }
}
