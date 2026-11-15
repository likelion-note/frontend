import { maskTargets } from '@/features/journal/mock/data'
import { eventLabel, partLabel } from '@/features/journal/labels'
import type {
  JournalPhase,
  MyJournal,
  MyProject,
  OrganizedJournal,
  PortfolioFormat,
} from '@/features/journal/types'

/**
 * 'AI 정리'와 '포트폴리오 요약'의 규칙 기반 목이에요. 백엔드 AI가 생기면
 * api.ts에서 이 함수들 대신 서버를 부르고, 화면은 같은 결과 모양(OrganizedJournal 등)을 써요.
 */

export const resultPlaceholder = '[결과 수치 입력]'

/** 팀원 이름은 [팀원 A], [팀원 B]…, 팀 이름은 [우리 팀]으로 가려요. 같은 이름은 같은 글자로요. */
export function maskNames(texts: string[]) {
  const letters = new Map<string, string>()
  let count = 0
  const masked = texts.map((source) => {
    let result = source
    for (const team of maskTargets.teams) {
      const parts = result.split(team)
      count += parts.length - 1
      result = parts.join('[우리 팀]')
    }
    for (const person of maskTargets.people) {
      if (!result.includes(person)) continue
      if (!letters.has(person)) letters.set(person, String.fromCharCode(65 + letters.size))
      const parts = result.split(person)
      count += parts.length - 1
      result = parts.join(`[팀원 ${letters.get(person)}]`)
    }
    return result
  })
  return { masked, count }
}

/** 단어 → 상황 태그. 노트 게시판의 상황 필터와 같은 이름이에요. */
const tagRules: [RegExp, string, string][] = [
  [/의견|갈렸|충돌|다퉜|싸웠|반대/, '#의견 충돌', '의견이 갈렸을 때 정리한 방법'],
  [/역할|담당|분담|맡/, '#역할 분담', '역할을 다시 나눈 방법'],
  [/회의|안건/, '#회의 진행', '회의가 길어질 때 바꾼 방법'],
  [/일정|마감|밀렸|늦어|지연/, '#일정 지연', '일정이 밀렸을 때 따라잡은 방법'],
  [/바꿨|바꾸|변경/, '#주제 변경', '주제를 바꾸기로 한 과정'],
  [/주제|아이디어|후보/, '#주제 선정', '주제를 정한 기준'],
  [/발표|덱|리허설/, '#발표 준비', '발표를 준비하며 줄인 것'],
  [/참여|말이 없|조용/, '#팀원 참여도', '모두가 말하게 만든 방법'],
  [/배포|서버|환경변수/, '#배포', '배포에서 막혔다 넘긴 방법'],
]

const phasePrefix: Record<JournalPhase, string> = {
  early: '앞두고',
  soon: '앞두고',
  'event-week': '주간에',
  after: '끝나고',
}

/** 첫 문장. 마침표 · 물음표 · 느낌표나 줄바꿈까지예요. */
export function firstSentence(text: string) {
  const match = text.trim().match(/^[^\n]*?[.!?](?=\s|$)|^[^\n]+/)
  return (match?.[0] ?? '').trim()
}

/** 가린 곳이 보이도록 '이렇게 넘겼어요' 일부를 잘라요. 앞이 잘리면 '…'을 붙여요. */
function excerptAround(text: string, token = '[') {
  const index = text.indexOf(token)
  if (index < 0) return null
  if (text.length <= 48) return text
  // 단어 중간에서 자르지 않도록 24자 앞쪽의 다음 띄어쓰기부터 보여줘요.
  const rough = Math.max(0, index - 24)
  const space = rough > 0 ? text.indexOf(' ', rough) : 0
  const start = space >= 0 && space < index ? space : rough
  return `${start > 0 ? '…' : ''}${text.slice(start).trim()}`
}

export function organizeJournal(journal: MyJournal): OrganizedJournal {
  const { masked, count } = maskNames([
    journal.body.stuck,
    journal.body.overcame,
    journal.body.nextTime,
  ])
  const [stuck, overcame, nextTime] = masked
  const all = `${stuck}\n${overcame}\n${nextTime}`
  const matched = tagRules.filter(([pattern]) => pattern.test(all))
  const tags = (matched.length ? matched : [tagRules[2]]).slice(0, 3).map(([, tag]) => tag)
  const topic = (matched[0] ?? tagRules[2])[2]
  const title =
    journal.eventType && journal.phase && journal.eventType !== 'ETC'
      ? `${eventLabel(journal.eventType)} ${phasePrefix[journal.phase]} ${topic}`
      : topic
  const preview = firstSentence(overcame) || firstSentence(stuck)
  const category = tags[0] === '#회의 진행' ? '회의' : '역할별 가이드'
  const followUp =
    overcame.replace(/\s/g, '').length < 40
      ? '그때 팀원들에게 실제로 뭐라고 말했는지, 무엇을 바꿨는지 한 줄 더 적어줄래요?'
      : !nextTime.trim()
        ? '다시 한다면 무엇을 가장 먼저 할지 한 줄 적어줄래요?'
        : null
  return {
    title,
    preview,
    tags,
    maskedCount: count,
    maskedExcerpt: count > 0 ? excerptAround(overcame) : null,
    category,
    followUp,
    body: { stuck, overcame, nextTime },
  }
}

/** 보완 질문 답을 '이렇게 넘겼어요'에 더하고, 이름도 다시 가려요. */
export function appendFollowUp(journal: MyJournal, answer: string): MyJournal {
  const overcame = [journal.body.overcame.trim(), answer.trim()].filter(Boolean).join(' ')
  const next = { ...journal, body: { ...journal.body, overcame } }
  const organized = organizeJournal(next)
  return {
    ...next,
    // 사용자가 뺀 태그는 다시 넣지 않아요.
    organized: {
      ...organized,
      title: journal.organized?.title ?? organized.title,
      tags: journal.organized?.tags ?? organized.tags,
      followUp: null,
    },
  }
}

/** 문장 끝 '~었어요.'를 '~었고, 그 결과 [결과 수치 입력]'으로 이어요. 숫자가 있으면 그대로 둬요. */
function withResult(sentence: string) {
  const plain = sentence.replace(/[.!?]$/, '')
  if (/\d/.test(plain)) return plain
  if (/(었|았|했)어요$/.test(plain))
    return `${plain.replace(/어요$/, '고')}, 그 결과 ${resultPlaceholder}`
  return `${plain} (결과: ${resultPlaceholder})`
}
const plainSentence = (text: string) => firstSentence(text).replace(/[.!?]$/, '')

/**
 * 프로젝트의 내 일지로 이력서 문장을 만들어요. 작성 중인 일지는 빼요.
 * variant가 바뀌면(다시 만들기) 문장으로 쓰는 일지 순서를 돌려요.
 */
export function summarizePortfolio(
  project: MyProject,
  journals: MyJournal[],
  format: PortfolioFormat,
  variant: number,
) {
  const used = journals.filter((journal) => journal.status !== 'DRAFT')
  const ranked = [...used].sort(
    (left, right) =>
      right.helpfulCount - left.helpfulCount ||
      (right.submittedAt ?? '').localeCompare(left.submittedAt ?? ''),
  )
  const offset = ranked.length ? variant % ranked.length : 0
  const order = [...ranked.slice(offset), ...ranked.slice(0, offset)]
  const body = (journal: MyJournal) => journal.organized?.body ?? journal.body
  const [first, second] = order
  const part = first?.part ? partLabel(first.part) : ''
  const learned = order.map((journal) => body(journal).nextTime.trim()).find(Boolean)
  const heading = [project.title, part].filter(Boolean).join(' | ')

  const lines =
    format === 'resume'
      ? [
          first && `• ${plainSentence(body(first).overcame)}`,
          second && `• ${withResult(firstSentence(body(second).overcame))}`,
          learned && `• 배운 점: ${plainSentence(learned)}`,
        ]
      : [
          [
            `${project.title}에서 ${part || '팀원'}로 참여했어요.`,
            first && `${plainSentence(body(first).overcame)}.`,
            second && `또 ${withResult(firstSentence(body(second).overcame))}.`,
            learned && `이 경험으로 ${plainSentence(learned)}.`,
          ]
            .filter(Boolean)
            .join(' '),
        ]
  return {
    heading,
    lines: lines.filter((line): line is string => !!line),
    journalIds: used.map((journal) => journal.id),
  }
}
