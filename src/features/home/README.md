# 홈 화면

세 상태 모두 `/home`을 사용합니다. 파트 배정 여부를 먼저 확인한 다음 프로젝트 진행 여부를 판단합니다. BottomNav는 HomePage에서 한 번만 렌더링합니다. 기존 MobileLayout의 안전 영역을 사용하며 OS 상태바는 웹에서 재현하지 않습니다.

## 개발 중 화면 확인

`npm run dev` 실행 후 다음 주소를 여세요. 별도 개발용 UI는 노출하지 않습니다.

| 화면                    | URL                                           |
| ----------------------- | --------------------------------------------- |
| 기존 기본 화면          | `/home`                                       |
| 파트 배정 전            | `/home?partAssigned=false`                    |
| 프로젝트 진행 중        | `/home?partAssigned=true&projectActive=true`  |
| 프로젝트 기간 외        | `/home?partAssigned=true&projectActive=false` |
| 파트 배정 우선순위 확인 | `/home?partAssigned=false&projectActive=true` |

배정 미리보기는 개발용 Mock 모드에서만 동작합니다. `partAssigned=false`는 미배정을 표시하고, `partAssigned=true`는 PENDING 데이터를 ASSIGNED로 만들지 않습니다. 프로젝트 기간 미리보기는 기존처럼 개발 환경에서만 적용됩니다. 프로덕션에서는 배정 API가 준비되기 전까지 오류를 표시하며 Mock으로 대체하지 않습니다.

## 데이터와 API 연결

- `types.ts`: 기존 HomeData/Todo/ArchiveNote 및 신규 HomeState/HomeUser/BeforePartHomeData/InactiveHomeData 계약.
- `mock/data.ts`: 기존 프로젝트 진행 중 콘텐츠. 사용자 배정 정보는 포함하지 않습니다.
- `mock/states.ts`: 프로젝트 진행 여부 및 두 화면의 콘텐츠 Mock입니다. 사용자 배정 정보는 별도 공통 조회를 사용합니다.
- `state.ts`: 상태 판단 순수 함수 및 개발용 쿼리 파싱. 파트 미배정이 우선입니다.
- `useHomeData.ts`: 공통 배정 조회를 HomeUser 표시 데이터로 변환합니다. 체크는 기존 가이드 완료 저장소, 도움돼요는 기존 페이지 상태를 유지합니다.
- `components/`: HomeHeader와 ArchiveSection을 세부 상태에 맞춰 재사용합니다. 기존 ProjectActiveHome과 공통 BottomNav의 구현은 유지했습니다.

목적지가 없는 액션과 메뉴는 비활성화 상태입니다. 기존 /notes, /me는 관리자 레이아웃의 준비 중 화면이므로 연결하지 않았습니다. 화면 구현 후 HomeAction.to, ArchiveNote.to, BottomNavItem.to를 지정하세요.

Figma 정적 에셋은 `src/assets/home/`에 저장합니다. 신규 배경 두 개, 배너 점, 노트 아이콘, 손글씨 인용을 추가했습니다. 원본 스프라이트와 SVG 치수는 유지합니다. 손글씨를 API의 동적 문구로 교체할 때는 텍스트 렌더링으로 전환하세요.

## 사용자 배정 조회 변경

배정 정보와 상태는 `../assignment/README.md`를 참고하세요. 위 문서의 사용자 정보·배정 상태 관련 기존 Mock 설명은 공통 배정 조회로 대체되었습니다. 프로젝트 진행 여부만 `mock/states.ts`에서 관리합니다. 프로덕션에서는 배정 API 미연결 오류를 표시하며 Mock으로 대체하지 않습니다.
