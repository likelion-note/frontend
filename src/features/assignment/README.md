# 사용자 배정 정보

- 배정 정보는 로그인한 사용자 기준입니다(`lib/currentUser.ts`). 목 모드(`VITE_USE_MOCK`이 false가 아님)에서는 운영진 목 저장소의 멤버 배정을 그대로 읽어서, 운영진이 멤버 화면에서 배정하면 그 사람의 홈 · 가이드 · 노트 기본 필터 · 새 일지 기본값이 함께 바뀝니다. 목 계정 '데옹'은 PM · 멋사수첩팀, 새로 가입한 계정은 배정 전입니다. 실제 모드에서는 로그인 응답(`/api/me`)의 배정을 씁니다.
- 배포(프로덕션 빌드)에서도 목 모드면 같은 방식으로 동작합니다. 예전처럼 개발 서버에서만 목을 쓰지 않습니다.
- `.env.development`의 `VITE_ASSIGNMENT_SOURCE=mock`은 개발 서버의 미리보기 쿼리(`?userPart=`, `?partAssigned=false`)를 켜는 데만 씁니다.
- `useMyAssignment`는 로그인 세션의 사용자를 쿼리 키에 포함하여 계정별 캐시를 분리합니다. 로그인 · 로그아웃할 때 쿼리 캐시를 비웁니다.
- 전용 배정 API가 생기면 `api.ts`의 `getMyAssignment` 안쪽만 바꾸세요.
- `AssignmentBoundary`가 로딩/오류/재시도를 처리한 뒤 기존 페이지를 렌더링합니다. 실패 시 이전 배정값도 표시하지 않습니다.
- 개발 확인: `/home?userPart=FRONTEND`, `/home?partAssigned=false`, `/home?projectActive=false`. userPart는 ASSIGNED Mock의 표시만 바꾸며, PENDING을 ASSIGNED로 만들지 않습니다. 가이드의 `part` 탐색 탭은 배정 쿼리 캐시를 변경하지 않습니다.
- 프로젝트 진행 여부와 홈의 다른 콘텐츠는 이번 범위에 포함하지 않아 기존 Mock을 유지합니다.
