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

URL 덮어쓰기는 `import.meta.env.DEV`에서만 작동합니다. 프로덕션 빌드에서는 쿼리를 무시하고 기본 Mock 설정을 사용합니다. 잘못된 쿼리 값도 기본 설정을 유지합니다. 기본 상태를 바꾸려면 `mock/states.ts`의 `mockHomeState`에서 isPartAssigned/isProjectActive를 변경하세요. 기존 기본값은 true/true입니다.

## 데이터와 API 연결

- `types.ts`: 기존 HomeData/Todo/ArchiveNote 및 신규 HomeState/HomeUser/BeforePartHomeData/InactiveHomeData 계약.
- `mock/data.ts`: 기존 프로젝트 진행 중 데이터. 변경하지 않았습니다.
- `mock/states.ts`: 기본 상태 및 두 신규 화면의 Mock 데이터. 공통 사용자·프로젝트·액션은 기존 Mock을 재사용합니다. 미배정 사용자의 part/team은 null입니다.
- `state.ts`: 상태 판단 순수 함수 및 개발용 쿼리 파싱. 파트 미배정이 우선입니다.
- `useHomeData.ts`: 향후 API 조회 및 변경 요청 연결 지점. 백엔드 사용자/프로젝트 응답을 HomeState와 각 화면 데이터로 변환하고 Mock 데이터 대신 반환하세요. 현재 체크·도움돼요는 페이지 메모리에서만 변경됩니다.
- `components/`: HomeHeader와 ArchiveSection을 세부 상태에 맞춰 재사용합니다. 기존 ProjectActiveHome과 공통 BottomNav의 구현은 유지했습니다.

목적지가 없는 액션과 메뉴는 비활성화 상태입니다. 기존 /notes, /me는 관리자 레이아웃의 준비 중 화면이므로 연결하지 않았습니다. 화면 구현 후 HomeAction.to, ArchiveNote.to, BottomNavItem.to를 지정하세요.

Figma 정적 에셋은 `src/assets/home/`에 저장합니다. 신규 배경 두 개, 배너 점, 노트 아이콘, 손글씨 인용을 추가했습니다. 원본 스프라이트와 SVG 치수는 유지합니다. 손글씨를 API의 동적 문구로 교체할 때는 텍스트 렌더링으로 전환하세요.
