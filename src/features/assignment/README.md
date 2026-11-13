# 사용자 배정 정보

- `mock/data.ts`의 `mockUserAssignment`가 유일한 개발용 배정 예시입니다. 기수, 파트, 팀, 배정 상태를 여기서 변경합니다. 기존 `Part`와 `UserType`을 재사용하므로 회원 유형은 MEMBER(아기사자)/ADMIN(운영진)입니다. PENDING이면 part/teamId/teamName을 null로 설정하세요.
- `.env.development`의 `VITE_ASSIGNMENT_SOURCE=mock`으로 개발 서버에서 명시적으로 사용합니다. 프로덕션은 이 값이나 미리보기 쿼리와 관계없이 Mock을 사용하지 않습니다. API 미연결 시 오류를 표시합니다.
- `useMyAssignment`는 기존 Mock 로그인 세션의 email을 쿼리 키에 포함하여 계정별 캐시를 분리합니다. 홈, 가이드, 회의 접근 조건은 같은 TanStack Query 데이터를 참조합니다. 로그인 세션에 배정 정보를 복제하지 않습니다.
- `api.ts`의 `getMyAssignmentFromBackend`에 추후 인증된 사용자 배정 조회와 응답 변환을 연결하세요. 현재 네트워크 요청은 없고, 실패를 Mock으로 대체하지 않습니다. 배정 변경을 저장하는 프론트 API도 없습니다.
- `AssignmentBoundary`가 로딩/오류/재시도를 처리한 뒤 기존 페이지를 렌더링합니다. 실패 시 이전 배정값도 표시하지 않습니다.
- 개발 확인: `/home?userPart=FRONTEND`, `/home?partAssigned=false`, `/home?projectActive=false`. userPart는 ASSIGNED Mock의 표시만 바꾸며, PENDING을 ASSIGNED로 만들지 않습니다. 가이드의 `part` 탐색 탭은 배정 쿼리 캐시를 변경하지 않습니다.
- 프로젝트 진행 여부와 홈의 다른 콘텐츠는 이번 범위에 포함하지 않아 기존 Mock을 유지합니다.
