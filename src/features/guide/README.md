# 파트 가이드

`/guide` 또는 프로젝트 진행 중 홈의 오늘 할 일 → 전체 보기에서 확인합니다. Figma처럼 BottomNav는 추가하지 않았습니다. 접근 조건은 기존 useHomeMode를 공유합니다.

- `mock/data.ts`: 4개 파트 × 1~6주차 가이드. 현재 주차는 기존 homeMockData.project.week를 재사용합니다. PM 2주차 할 일의 ID/텍스트/초기 상태도 기존 홈 데이터에서 가져옵니다. 나머지 23개 조합은 역할과 주차에 맞는 Mock 콘텐츠입니다.
- `types.ts`: 기존 Todo/HomeAction을 확장한 GuideTask, WeeklyGuide, GuideResource.
- `api.ts`: getWeeklyGuide/getGuideResources/getGuideResourceById의 비동기 Mock 조회. 실제 API 도입 시 이 함수들의 내부와 홈의 현재 주차 조회를 교체하세요. Query 키는 파트·주차를 포함하여 빠른 전환에서도 이전 응답이 다른 선택에 표시되지 않습니다.
- `completionStore.ts`, `useGuideCompletion.ts`: localStorage `likelion-guide-completion:v1`의 사용자·프로젝트·파트·주차·할 일 ID별 boolean override. useSyncExternalStore로 같은 화면·다른 탭의 변경을 구독합니다. 저장 실패 시 메모리에 유지하며 토스트를 표시합니다.
- `useGuideContext.ts`: 실제 사용자 배정 파트와 탐색용 part를 구분합니다. 공통 useMyAssignment 조회를 사용하고 파트 미배정 시 null을 유지합니다.
- `components/`: 자료 메타데이터 카드, 기획서 목록 바텀시트, 운영진 메모. 파일 URL은 현재 모두 null이며 자료 카드를 누르면 ID로 조회한 목차 미리보기를 표시합니다. 실제 PDF 로딩이나 가짜 파일 URL은 사용하지 않습니다.

## 확인 방법

- 기본 `/home` → 전체 보기: PM 2주차.
- 페이지 상단에서 PM/디자인/프론트/백엔드를 탐색하고 주차 드롭다운으로 1~6주차를 선택합니다. 탐색 파트는 사용자의 실제 배정 정보를 바꾸지 않습니다.
- 개발에서 배정 파트별 홈을 확인하려면 `/home?userPart=DESIGN`, `FRONTEND`, `BACKEND`, `PM`을 사용합니다. 실제 사용자에게 개발용 UI는 표시하지 않으며 프로덕션에서는 userPart 쿼리를 무시합니다.
- `/guide?part=FRONTEND&week=3`은 탐색 대상만 선택합니다. 잘못된 파트·주차는 현재 배정 파트·진행 주차로 돌아갑니다.
- 홈과 가이드에서 같은 할 일을 체크한 뒤 왕복하거나 새로고침하여 상태 일치를 확인할 수 있습니다.

## 연결한 기능

홈과 가이드는 공통 TaskChecklist를 사용합니다. 홈의 기존 제목·진행 링·오늘 표시와 디자인은 유지했습니다. 홈의 할 일 액션도 회의/자료로 연결됩니다. PM 2주차의 회의 도우미 링크는 `meetingType=idea`로 기존 회의 화면에 진입합니다. 이 일회성 값은 진입 직후 URL에서 제거하여 이후 수동 유형 선택과 저장 상태를 덮어쓰지 않습니다. 기획서 링크는 같은 자료 타입의 A/B/C팀 메타데이터를 기존 BottomSheet로 표시합니다.

손글씨 SVG와 졸업 사자, 폴더·달력 스프라이트는 기존 원본 에셋을 재사용했습니다. PM 2주차 운영진 메모는 Figma 손글씨, 다른 파트·주차는 실제 동적 메시지를 텍스트로 렌더링합니다. 신규 배경은 src/assets/guide에 저장합니다.

## 자료 보기 바텀시트

파트 가이드의 참고 자료 카드 또는 기획서 목록의 자료를 누르면 ResourcePreviewBottomSheet가 열립니다. 페이지 이동 없이 같은 BottomSheet 인스턴스의 목록/미리보기 내용을 전환하여 중첩 오버레이와 배경 잠금 충돌을 피합니다. 닫기 전후 파트·주차·체크 상태와 배경 스크롤 위치를 유지합니다.

- `mock/resourcePreviews.ts`: 기존 GuideResource를 확장한 자료별 previewTitle/previewDescription/previewItems. PM 2주차 A팀은 Figma 목차, B/C팀 및 다른 파트·주차는 해당 자료에 맞는 서로 다른 Mock 목차를 사용합니다.
- `api.ts`의 getGuideResourceById: 선택 ID로 상세 데이터를 조회하는 API 교체 지점. 목록 메타데이터와 상세 조회를 분리했으며 Query 키에 자료 ID를 포함합니다. 로딩/오류·재시도/없는 자료/빈 목차를 처리합니다.
- `components/ResourcePreviewBottomSheet.tsx`: Figma의 오버레이, 26px 모서리, 제목·설명·목차·장식선·닫기 버튼. 기존 닫기 SVG와 공통 Card/Button을 재사용합니다.
- `hooks/useBottomSheetDrag.ts`: 100px 이동 또는 20px 이상 이동 + 최근 구간 속도 0.65px/ms 이상일 때 닫습니다. 이벤트 시각을 사용하여 렌더링 지연과 입력 속도를 구분합니다. 짧은 느린 드래그는 복귀합니다.
- 핸들은 터치/마우스로 즉시 드래그합니다. 본문의 터치는 스크롤 최상단에서 시작한 명확한 아래 방향 동작만 가로챕니다. 내부의 위 방향 스크롤이나 이미 스크롤된 본문은 닫기로 처리하지 않습니다.
- 공통 BottomSheet의 전체 슬라이드·본문 제스처는 선택형 옵션입니다. 기존 회의 시트는 기본 거리/애니메이션 설정을 유지합니다. 자료 시트는 280ms로 열고 닫고, 닫힘이 끝난 후 언마운트합니다. X/하단 버튼/오버레이/Escape/드래그 모두 같은 닫기 경로를 사용합니다. 축소 동작 설정도 고려합니다.

검증: 네 파트 및 다른 주차/기획서 목록의 자료 선택, 제목·목차 일치, 포커스 잠금·복귀, 실제 터치와 마우스 드래그/복귀/속도 닫기, 작은 화면의 긴 목차 스크롤, 조회 오류/빈 상태/지연 응답 격리. 원본 파일 열기는 이번 디자인 범위에 포함하지 않았습니다.
