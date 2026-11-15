import presentationQuote from '@/assets/home/quote-presentation.svg'
import { homeMockData } from '@/features/home/mock/data'
import type { Note, NotePart, NotePhase } from '@/features/note/types'

/** 우리 기수. 홈의 노트 통계와 같은 값을 써요. */
export const currentCohort = homeMockData.noteStats.cohort

export const noteParts: { id: NotePart; label: string }[] = [
  { id: 'PM', label: 'PM' },
  { id: 'DESIGN', label: '디자인' },
  { id: 'FRONTEND', label: '프론트' },
  { id: 'BACKEND', label: '백엔드' },
  { id: 'STAFF', label: '운영진' },
]

/** label은 카드·상세, filterLabel은 시점 필터에 써요. */
export const notePhases: { id: NotePhase; label: string; filterLabel: string }[] = [
  { id: 'early', label: '2주 이상 전', filterLabel: '2주 이상 전' },
  { id: 'soon', label: '1~2주 전', filterLabel: '1~2주 전 · 지금' },
  { id: 'event-week', label: '행사 주간', filterLabel: '행사 주간' },
  { id: 'after', label: '행사 후', filterLabel: '행사 후' },
]

/** 상황 필터. 가로로 밀어서 더 볼 수 있어요. */
export const noteSituationTags = [
  '#역할 분담',
  '#회의 진행',
  '#의견 충돌',
  '#주제 선정',
  '#일정 지연',
  '#발표 준비',
  '#팀원 참여도',
  '#배포',
]

/** 검색 결과가 없을 때 추천하는 검색어. 피그마 문구 그대로예요. */
export const noteSearchSuggestions = ['회의', '개발자', '배포', '#일정지연', '#팀원참여도']

/**
 * 노트 목 데이터. 홈의 '지난 기수는 이맘때' 카드와 같은 id를 써서 홈에서 바로 상세로 열 수 있어요.
 * 본문 속 사람은 [팀원 A]처럼 익명으로 적어요.
 */
export const notes: Note[] = [
  {
    id: 'meeting-agenda',
    cohort: 14,
    part: 'PM',
    event: '정기 세션',
    phase: 'early',
    title: '회의 안건을 하루 전에 올리게 된 계기',
    excerpt:
      '회의 전날 밤 9시까지 안건을 슬랙에 올리고, 못 올린 안건은 다음 회의로 넘기기로 했어요.',
    tags: ['#회의 진행'],
    sections: {
      stuck:
        '회의 때마다 안건을 그 자리에서 정하다 보니 한 시간이 금방 지나갔어요. 정작 정해야 할 건 못 정하고 끝난 날이 많았어요.',
      solved:
        '회의 전날 밤 9시까지 안건을 슬랙에 올리고, 못 올린 안건은 다음 회의로 넘기기로 했어요. 회의 시간이 절반으로 줄었어요.',
      retry: '첫 회의에서 바로 이 규칙부터 정할 거예요.',
    },
    readCount: 14,
    helpfulCount: 6,
    createdAt: '2026-10-25',
  },
  {
    id: 'presentation-deck',
    cohort: 13,
    team: 'F팀',
    part: 'PM',
    event: '중간발표',
    phase: 'soon',
    title: '중간발표 덱을 3장으로 줄인 날',
    excerpt: '발표보다 질문이 먼저 나왔어요',
    handwrittenImage: { src: presentationQuote, width: 194, height: 30 },
    tags: ['#발표 준비'],
    sections: {
      stuck:
        '보여주고 싶은 게 많아서 덱이 15장까지 늘어났어요. 리허설을 해 보니 5분 안에 절반도 못 넘겼어요.',
      solved:
        '문제 · 해결 · 데모 세 장만 남기고 나머지는 부록으로 뺐어요. 발표보다 질문이 먼저 나와서 오히려 이야기가 잘 됐어요.',
      retry: '덱을 만들기 전에 세 문장으로 먼저 말해 볼 거예요.',
    },
    readCount: 52,
    helpfulCount: 19,
    createdAt: '2026-10-24',
  },
  {
    id: 'hackathon-roles',
    cohort: 13,
    team: 'F팀',
    part: 'PM',
    event: '해커톤',
    phase: 'event-week',
    title: '해커톤 전날 역할을 다시 나눈 이유',
    excerpt: '기능 목록 옆에 이름을 하나씩만 붙이고, 이름이 두 개 붙은 건 다시 나눴어요.',
    tags: ['#역할 분담'],
    sections: {
      stuck:
        '해커톤 전날 보니 한 기능을 두 사람이 따로 만들고 있었어요. 서로 상대가 하는 줄 알고 있었어요.',
      solved:
        '기능 목록 옆에 이름을 하나씩만 붙이고, 이름이 두 개 붙은 건 다시 나눴어요. 겹치던 시간이 바로 줄었어요.',
      retry: '역할은 사람 기준이 아니라 기능 기준으로 먼저 나눌 거예요.',
    },
    readCount: 38,
    helpfulCount: 12,
    createdAt: '2026-10-22',
  },
  {
    id: 'topic-split',
    cohort: 14,
    part: 'PM',
    event: '중간발표',
    phase: 'soon',
    title: '중간발표 주제를 두고 팀이 둘로 갈렸을 때',
    excerpt:
      '각자 주제의 장단점을 3줄씩 써서 돌려 읽고, 데모 때 보여줄 화면이 더 많은 쪽으로 정했어요.',
    tags: ['#의견 충돌', '#주제 변경'],
    sections: {
      stuck:
        '중간발표를 2주 앞두고 지금 주제를 밀고 갈지 바꿀지로 팀이 반반 갈렸어요. 이야기할수록 서로 감정이 상했어요.',
      solved:
        '각자 주제의 장단점을 3줄씩 써서 돌려 읽고, 데모 때 보여줄 화면이 더 많은 쪽으로 정했어요. [팀원 A]이 먼저 양보해 줬어요.',
      retry: '감정이 상하기 전에 쓰기로 먼저 정리할 거예요.',
    },
    readCount: 47,
    helpfulCount: 17,
    createdAt: '2026-10-21',
  },
  {
    id: 'changed-topic',
    cohort: 13,
    team: 'B팀',
    part: 'PM',
    event: '중간발표',
    phase: 'soon',
    title: '주제를 중간에 바꿨던 3주차 이야기',
    excerpt: '일주일 미룬 게 제일 아까웠어요.',
    tags: ['#주제 변경', '#주제 선정'],
    sections: {
      stuck:
        '3주차에 사용자 인터뷰를 해 보니 우리가 생각한 문제가 실제로는 크지 않았어요. 바꿀지 말지 일주일을 고민했어요.',
      solved:
        '인터뷰에서 가장 많이 나온 불편 하나로 주제를 좁혀서 다시 시작했어요. 기존 화면 중 절반은 그대로 살렸어요.',
      retry: '일주일 미룬 게 제일 아까웠어요. 고민은 이틀까지만 할 거예요.',
    },
    readCount: 41,
    helpfulCount: 17,
    createdAt: '2026-10-20',
  },
  {
    id: 'meeting-rules',
    cohort: 13,
    team: 'D팀',
    part: 'PM',
    event: '정기 세션',
    phase: 'early',
    title: '회의가 계속 길어져서 정한 규칙 3가지',
    excerpt: '회의 시작 전에 안건을 슬랙에 먼저 올리기로 했더니 회의가 절반으로 줄었어요.',
    tags: ['#회의 진행'],
    sections: {
      stuck: '회의가 매번 두 시간을 넘겼어요. 끝나고 나면 뭘 정했는지 기억나는 사람이 없었어요.',
      solved:
        '안건은 미리 올리기, 안건마다 10분 타이머, 끝나기 전에 정한 것 읽어 주기. 세 가지만 지켰더니 회의가 절반으로 줄었어요.',
      retry: '회의록 담당을 매주 돌아가며 맡을 거예요.',
    },
    readCount: 33,
    helpfulCount: 21,
    createdAt: '2026-10-18',
  },
  {
    id: 'quiet-teammate',
    cohort: 14,
    part: 'PM',
    event: '정기 세션',
    phase: 'early',
    title: '말이 없던 팀원이 먼저 의견을 내기 시작한 방법',
    excerpt: '회의 전에 각자 한 줄씩 의견을 적어 오게 했더니 모두가 한 번씩은 말하게 됐어요.',
    tags: ['#팀원 참여도', '#회의 진행'],
    sections: {
      stuck:
        '회의에서 늘 말하는 사람만 말했어요. [팀원 B]는 끝날 때까지 한마디도 안 한 날이 많았어요.',
      solved:
        '회의 전에 각자 한 줄씩 의견을 적어 오게 하고, 적어 온 순서대로 읽었어요. 모두가 한 번씩은 말하게 됐어요.',
      retry: '첫 회의부터 돌아가며 말하는 순서를 정할 거예요.',
    },
    readCount: 19,
    helpfulCount: 9,
    createdAt: '2026-10-16',
  },
  {
    id: 'schedule-slip',
    cohort: 12,
    team: 'A팀',
    part: 'PM',
    event: '해커톤',
    phase: 'after',
    title: '일정이 밀린 걸 너무 늦게 알았던 이유',
    excerpt: '진행률을 말로만 물어봤더니 다들 거의 다 됐다고 했어요.',
    tags: ['#일정 지연'],
    sections: {
      stuck:
        '진행률을 말로만 물어봤더니 다들 거의 다 됐다고 했어요. 해커톤 이틀 전에야 절반이 남은 걸 알았어요.',
      solved: '남은 이틀은 기능을 셋으로 줄이고, 매일 저녁 실제 화면을 보여주는 시간을 가졌어요.',
      retry: '처음부터 "된 것"은 화면으로 보여주기로 정할 거예요.',
    },
    readCount: 61,
    helpfulCount: 28,
    createdAt: '2026-10-12',
  },
  {
    id: 'first-planning',
    cohort: 12,
    team: 'C팀',
    part: 'PM',
    event: '정기 세션',
    phase: 'early',
    title: '기획서 첫 장에 문제 한 문장만 남긴 이유',
    excerpt: '문제를 한 문장으로 못 쓰면 아직 주제가 정해진 게 아니었어요.',
    tags: ['#주제 선정'],
    sections: {
      stuck: '기획서가 기능 목록으로만 가득했어요. 왜 만드는지 물어보면 팀원마다 답이 달랐어요.',
      solved:
        '기획서 첫 장에 "누가, 언제, 무엇 때문에 불편한가" 한 문장만 남겼어요. 그 문장이 정해지자 기능이 저절로 줄었어요.',
      retry: '문제를 한 문장으로 쓰기 전에는 기능 이야기를 안 할 거예요.',
    },
    readCount: 44,
    helpfulCount: 22,
    createdAt: '2026-10-08',
  },
  {
    id: 'design-handoff',
    cohort: 13,
    team: 'E팀',
    part: 'DESIGN',
    event: '중간발표',
    phase: 'early',
    title: '피그마 시안을 개발자에게 넘길 때 놓친 것',
    excerpt: '빈 화면과 오류 화면을 안 그려서 개발자가 매번 물어봤어요.',
    tags: ['#역할 분담'],
    sections: {
      stuck: '예쁜 화면만 그려서 넘겼더니 빈 목록이나 오류 화면은 개발자가 매번 따로 물어봤어요.',
      solved: '화면마다 기본 · 빈 상태 · 오류 세 장을 같이 그려서 넘겼어요. 질문이 확 줄었어요.',
      retry: '시안을 넘기기 전에 상태별 체크리스트를 먼저 볼 거예요.',
    },
    readCount: 29,
    helpfulCount: 11,
    createdAt: '2026-10-19',
  },
  {
    id: 'frontend-api-wait',
    cohort: 14,
    part: 'FRONTEND',
    event: '중간발표',
    phase: 'soon',
    title: 'API를 기다리지 않고 화면부터 만든 방법',
    excerpt: '목 데이터로 먼저 만들고 함수 안쪽만 나중에 바꿨어요.',
    tags: ['#일정 지연'],
    sections: {
      stuck: '백엔드 API가 나올 때까지 손을 놓고 있다 보니 중간발표 직전에 일이 몰렸어요.',
      solved:
        '응답 형식만 먼저 정하고 목 데이터로 화면을 만들었어요. API가 나오자 함수 안쪽만 바꿨어요.',
      retry: '첫 주에 응답 형식부터 같이 정할 거예요.',
    },
    readCount: 24,
    helpfulCount: 13,
    createdAt: '2026-10-23',
  },
  {
    id: 'backend-deploy',
    cohort: 13,
    team: 'A팀',
    part: 'BACKEND',
    event: '해커톤',
    phase: 'event-week',
    title: '배포를 발표 당일에 처음 해 봤던 날',
    excerpt: '로컬에서는 잘 되던 게 서버에서는 하나도 안 됐어요.',
    tags: ['#배포', '#일정 지연'],
    sections: {
      stuck: '로컬에서는 잘 되던 게 서버에서는 환경변수 하나 때문에 하나도 안 됐어요.',
      solved: '발표 직전에 급하게 고치고, 다음 날부터 매일 한 번씩 배포했어요.',
      retry: '첫 주에 빈 화면이라도 먼저 배포해 둘 거예요.',
    },
    readCount: 57,
    helpfulCount: 31,
    createdAt: '2026-10-15',
  },
  {
    id: 'staff-feedback',
    cohort: 13,
    part: 'STAFF',
    event: '정기 세션',
    phase: 'after',
    title: '돌려보낸 일지에 한 줄만 남기게 된 이유',
    excerpt: '길게 쓴 피드백은 오히려 안 읽혔어요.',
    tags: ['#팀원 참여도'],
    sections: {
      stuck: '일지마다 길게 피드백을 남겼는데, 아기사자들이 끝까지 읽지 않았어요.',
      solved:
        '고쳐 줬으면 하는 것 한 가지만 한 줄로 남겼어요. 다시 내는 일지가 더 빨리 돌아왔어요.',
      retry: '칭찬 한 줄도 같이 남길 거예요.',
    },
    readCount: 16,
    helpfulCount: 8,
    createdAt: '2026-10-10',
  },
]
