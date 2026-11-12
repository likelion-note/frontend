# 회의 도우미

`/meeting` 또는 홈 하단 회의 탭에서 확인합니다. 파트 배정 완료 + 프로젝트 진행 중 상태만 구현했습니다. 그 외 상태로 직접 접근하면 동일한 상태의 `/home`으로 돌아갑니다. 홈과 `useHomeMode`를 공유합니다.

- `mock/data.ts`: 유형별 제목·질문, 초기값, 세 상황별 해결 단계, 지난 기수 사례.
- `types.ts`: MeetingDefinition/MeetingDraft/HelpSituation/PreviousTeamTip 데이터 계약.
- `useMeeting.ts`: 시간·유형·질문 완료 상태. 유형별로 독립적이며 sessionStorage에 저장되어 탭/페이지 이동과 새로고침 후에도 유지됩니다. 브라우저 탭 세션을 닫으면 초기화됩니다. 저장소 오류 시 메모리 상태로 동작합니다.
- `useMeetingSwipe.ts`: 48px 이상, 가로 이동이 세로의 1.5배 이상인 제스처만 처리합니다. 세로 스크롤은 브라우저가 처리하며 양 끝 유형을 넘어가지 않습니다.
- `api.ts`: 지난 기수 사례 비동기 조회의 API 교체 지점. 현재 실제 네트워크 요청 없이 Mock 데이터를 반환합니다.
- `MeetingHelpBottomSheet`: React Query 기반 로딩/오류/빈 목록/재시도 처리. 사례 카드를 누르면 해당 상황의 상세 본문이 펼쳐집니다.

공통 BottomNav/Segment/Button/Card/BottomSheet와 기존 원본 스프라이트·손글씨 에셋을 재사용합니다. BottomSheet의 motion은 새 회의 화면에서만 활성화하며 닫힘 애니메이션, 배경 스크롤/포커스 잠금, Escape/Tab, 핸들 드래그 닫기를 제공합니다.

시간 버튼을 누르면 시(00~23)와 분(00~59)을 따로 선택합니다. 변경은 즉시 반영되며 1분 단위입니다. 회의 유형 탭은 클릭과 키보드 방향키로도 조작합니다.

회의 정리 페이지는 미구현이므로 해당 버튼만 비활성화했습니다. 정리 동작은 MeetingPage의 onFinish 콜백으로 연결합니다. 실제 API 도입 시 상태 조회/저장 요청과 사용자별 저장 정책을 useMeeting에 연결하고 getPreviousTeamTips를 교체하세요.

## 지난 회의

`/meeting/history` 또는 회의 도우미 상단의 지난 회의 링크로 이동합니다. 뒤로 버튼은 `/meeting`으로 복귀하며 개발용 상태 쿼리를 유지합니다. Figma처럼 이 상세 페이지에는 BottomNav를 추가하지 않았습니다.

- `mock/records.ts`: 고유 ID를 가진 세 회의의 날짜, 결정 사항, 담당 업무와 ISO 기한.
- `types.ts`: 기존 MeetingType을 재사용하는 MeetingRecord/MeetingActionItem 계약.
- `api.ts`의 `getMeetingRecords`: 최신 날짜순 정렬 및 Mock 조회. 실제 API 조회로 교체할 지점입니다.
- `useMeetingRecords.ts`: 메인 화면의 기록 개수와 목록이 공유하는 React Query 조회. 로딩/빈 목록/오류/재시도를 처리합니다.
- `MeetingHistoryCard`: 최초 최신 회의만 열고, 이후 각 ID별 카드가 독립적으로 토글됩니다. 고정 높이 없이 CSS grid로 애니메이션하며 닫힌 영역은 포커스와 접근성 트리에서 제외합니다.
- `formatRecord.ts`: 화면과 공유 텍스트가 같은 담당 업무/기한 표현을 사용합니다.
- `shareRecord.ts`: Web Share API를 우선 사용하고 미지원 또는 공유 실패 시 클립보드로 복사합니다. 공유 취소 시에는 복사하지 않습니다. 미지원·권한 거부·성공·취소는 기존 토스트로 안내합니다. 서버 업로드와 가짜 공유 URL은 없습니다.

검증: 페이지 이동/복귀, 독립 아코디언, 회의별 공유 텍스트, Chrome 실제 클립보드 복사, Web Share 성공/취소 분기, 권한 거부 및 미지원 피드백, 320/390/430px 확장 카드 스크롤. OS 공유 앱 선택은 기기의 Web Share 지원에 따릅니다.
