import { getMockWeeklyGuide, guideResources } from '@/features/guide/mock/data'
import type { GuidePart, GuideResource } from '@/features/guide/types'

const secondWeekItems: Record<GuidePart, string[]> = {
  PM: [
    '누구의 어떤 불편인가',
    '핵심 화면 5개와 화면별 필요한 정보',
    '정보가 없을 때 보여줄 화면',
    '6주 일정과 빼도 되는 기능',
  ],
  DESIGN: [
    '디자인 컨셉 및 무드보드',
    '주요 화면 와이어프레임',
    'UI 컴포넌트 구성',
    '최종 디자인 피드백',
  ],
  FRONTEND: [
    '프로젝트 폴더 구조',
    '공통 컴포넌트 설계',
    '라우팅 및 상태 관리 방식',
    'API 연동 시 주의 사항',
  ],
  BACKEND: [
    'API 엔드포인트 목록',
    '요청 및 응답 데이터 구조',
    '인증 및 권한 처리',
    '오류 응답 규칙',
  ],
}
const proposalItems: Record<string, string[]> = {
  'PM-2-B': [
    '사용자 인터뷰와 문제 정의',
    '기능 우선순위를 정한 기준',
    '파트별 작업 범위와 협업 방식',
    '주간 점검과 중간발표 준비',
  ],
  'PM-2-C': [
    '팀원 일정 공유가 필요한 순간',
    '사용자 흐름과 핵심 기능',
    '기획 변경과 의사결정 기록',
    '최종 발표에서 배운 점',
  ],
}

/** 실제 PDF 대신 자료별 주요 항목을 보여주는 Mock이에요. 원본 fileUrl은 null을 유지합니다. */
export const resourcePreviews: GuideResource[] = guideResources.map((resource) => ({
  ...resource,
  previewTitle: resource.title.replace(/\.(pdf|png|jpe?g)$/i, ''),
  previewDescription: `${resource.description} · 운영진이 정리해 둔 실제 자료예요`,
  previewItems:
    proposalItems[resource.id] ??
    (resource.week === 2
      ? secondWeekItems[resource.part]
      : [
          ...(getMockWeeklyGuide(resource.part, resource.week)?.tasks.map((task) => task.title) ??
            []),
          `${resource.week}주차 결과물과 다음 단계 확인 사항`,
        ]),
}))
