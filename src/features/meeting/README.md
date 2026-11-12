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

회의 정리 버튼은 작성 페이지로 연결됩니다. 정리 동작은 MeetingPage의 onFinish 콜백으로 연결합니다. 실제 API 도입 시 상태 조회/저장 요청과 사용자별 저장 정책을 useMeeting에 연결하고 getPreviousTeamTips를 교체하세요.

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

## 회의 정리 작성 · 저장 · 완료

회의 도우미의 `회의 마치고 정리하기`로 시작합니다. 선택된 유형/시간과 브라우저 로컬 날짜로 고유 ID가 있는 빈 초안을 만들고 `/meeting/summary/:id`로 이동합니다. 저장 후 `/meeting/summary/:id/complete`를 표시합니다. 완료 화면의 뒤로는 같은 ID의 편집 화면으로 돌아갑니다.

- `summaryDraft.ts`: 빈 행/초안 생성, 입력 검증, 기존 기록의 편집 변환, 저장 데이터 변환. 빈 추가 행은 제외하고 일부 작성한 행은 담당자/할 일/요일을 모두 검증합니다. 결정 사항의 줄바꿈·빈 줄을 보존합니다.
- `recordStore.ts`: 기존 Mock + localStorage의 `likelion-meeting-records:v1`을 ID로 합쳐 조회합니다. 저장은 ID 기준 upsert이며 기존 createdAt은 유지하고 updatedAt을 갱신합니다. 저장 실패 시 완료 화면으로 이동하지 않습니다. 작성 중 초안은 sessionStorage에 별도 보관합니다.
- `api.ts`: getMeetingRecords/getMeetingSummaryById/getMeetingSummaryDraft/saveMeetingSummary가 향후 API 연결 지점입니다. 실제 백엔드 도입 시 이 내부와 초안 저장 정책을 교체하세요.
- `MeetingSummaryForm`, `SummaryActionRow`, `AutoGrowTextarea`: 결정 사항과 긴 업무 내용 자동 확장, 행 추가/삭제, 각 행의 월~일 native select. 저장은 ref 잠금과 ID upsert로 중복을 방지합니다.
- `MeetingSummaryCard`, `MeetingSummaryCompletePage`: 저장한 ID의 데이터만 표시합니다. 완료 화면은 copyMeetingRecord를 사용해 클립보드로 직접 복사하며 Web Share를 열지 않습니다. 지난 회의도 같은 원문 포맷을 사용하지만 기존 Web Share 우선 정책은 유지합니다.
- `meetingDates.ts`: 연·월·일이 완전하고 유효한 회의 날짜만 이번 주 월요일~일요일에 포함합니다. 연도를 추정하지 않습니다. 새 업무는 dueDay를 저장하며 특정 마감 날짜를 임의로 만들지 않습니다. 기존 Mock 업무의 dueDate는 호환성을 위해 유지합니다.

저장 성공 시 기록 단건 및 목록 Query 캐시를 함께 갱신하므로 지난 회의 개수와 목록, 완료 화면의 주간 개수가 같은 데이터를 봅니다. 기록과 초안은 현재 브라우저의 로컬 저장이며 서버 동기화는 구현하지 않았습니다. 성장일지 버튼은 안내만 표시하며 onJournal 콜백으로 추후 연결할 수 있습니다.
