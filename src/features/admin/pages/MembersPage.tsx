import { useQuery } from '@tanstack/react-query'
import { Fragment, useState, type ReactNode } from 'react'

import { ChevronIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { Card, Divider } from '@/components/ui/Card'
import { Illust } from '@/components/ui/Illust'
import { Pill } from '@/components/ui/Pill'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { AdminPageHeader } from '@/features/admin/components/AdminHeader'
import { AdminContent } from '@/features/admin/components/AdminLayout'
import { AssignSheet } from '@/features/admin/components/AssignSheet'
import { CreateProjectSheet } from '@/features/admin/components/CreateProjectSheet'
import { MemberRow } from '@/features/admin/components/MemberRow'
import { MOCK_TODAY } from '@/features/admin/mock/data'
import { meQuery, membersQuery, projectsQuery } from '@/features/admin/queries'
import { ASSIGNABLE_PARTS, type Member, type ProjectCategory } from '@/features/admin/types'

/** 오늘 가입했으면 "방금 가입" */
const isNewMember = (m: Member) => m.joinedAt.slice(0, 10) === MOCK_TODAY

const partOrder = (m: Member) => (m.part ? ASSIGNABLE_PARTS.indexOf(m.part) : 99)

/** SCR-ADM-04 멤버·프로젝트 */
export function MembersPage() {
  const { data: me } = useQuery(meQuery())
  const { data: members = [] } = useQuery(membersQuery())
  const { data: projects = [] } = useQuery(projectsQuery())
  const [selected, setSelected] = useState<Member | null>(null)
  const [creating, setCreating] = useState(false)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ p1: true })

  const cohort = me?.cohort ?? 14
  const lions = members.filter((m) => m.type === 'MEMBER')
  const unassigned = lions
    .filter((m) => !m.part || !m.projectId)
    .sort((a, b) => b.joinedAt.localeCompare(a.joinedAt))
  const teamProjects = projects.filter((p) => p.kind === 'TEAM')
  const opsProjects = projects.filter((p) => p.kind === 'OPS')

  const membersOf = (projectId: string) =>
    lions.filter((m) => m.projectId === projectId).sort((a, b) => partOrder(a) - partOrder(b))

  const toggle = (id: string) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))

  // 접힌 프로젝트는 한 카드에 줄로 모으고, 펼친 프로젝트는 카드 하나를 차지해요
  const projectCards: ReactNode[] = []
  let collapsedGroup: ProjectCategory[] = []
  const flushGroup = () => {
    if (collapsedGroup.length === 0) return
    const group = collapsedGroup
    collapsedGroup = []
    projectCards.push(
      <Card key={`group-${group[0].id}`} className="py-1">
        {group.map((project, index) => (
          <Fragment key={project.id}>
            {index > 0 && <Divider />}
            <ProjectHeaderRow
              project={project}
              count={membersOf(project.id).length}
              expanded={false}
              onToggle={() => toggle(project.id)}
              className="py-3.5"
            />
          </Fragment>
        ))}
      </Card>,
    )
  }
  for (const project of teamProjects) {
    if (expanded[project.id]) {
      flushGroup()
      const list = membersOf(project.id)
      projectCards.push(
        <Card key={project.id} className="pt-3.5 pb-1.5">
          <ProjectHeaderRow
            project={project}
            count={list.length}
            expanded
            onToggle={() => toggle(project.id)}
            className="pb-1"
          />
          {list.length === 0 && (
            <p className="text-muted py-3 text-[13px]">아직 배정된 멤버가 없어요.</p>
          )}
          {list.map((member, index) => (
            <Fragment key={member.id}>
              {index > 0 && <Divider />}
              <MemberRow member={member} onClick={() => setSelected(member)} />
            </Fragment>
          ))}
        </Card>,
      )
    } else {
      collapsedGroup.push(project)
    }
  }
  flushGroup()

  return (
    <>
      <AdminPageHeader title="멤버" illust="people" />
      <AdminContent>
        <p className="text-ink-2 text-[13px] leading-normal">
          {cohort}기 아기사자 {lions.length}명. 사람을 누르면 파트와 프로젝트를 배정해요. 이 분류로
          일지와 포트폴리오가 묶여요.
        </p>

        {unassigned.length > 0 && (
          <section className="bg-unassigned border-accent/45 w-full rounded-2xl border-[1.4px] px-[18px] pt-3.5 pb-1.5">
            <div className="flex w-full items-center gap-1.5 pb-1">
              <h2 className="text-ink text-[15px] leading-tight font-bold">배정 전</h2>
              <Pill tone="danger" size="sm">
                {unassigned.length}명
              </Pill>
              <div className="flex-1" />
              <span className="text-danger text-[12px] leading-none font-medium">
                먼저 배정해 주세요
              </span>
            </div>
            {unassigned.map((member, index) => (
              <Fragment key={member.id}>
                {index > 0 && <Divider />}
                <MemberRow
                  member={member}
                  isNew={isNewMember(member)}
                  onClick={() => setSelected(member)}
                />
              </Fragment>
            ))}
          </section>
        )}

        <SectionTitle
          title="프로젝트"
          action={
            <span className="text-muted text-[13px] leading-none font-medium">
              팀 {teamProjects.length} · 운영 {opsProjects.length}
            </span>
          }
        />
        {projectCards}

        <SectionTitle title="운영 분류" />
        <Card className="py-1">
          {opsProjects.map((project, index) => {
            const admins = members.filter((m) => m.projectId === project.id)
            return (
              <Fragment key={project.id}>
                {index > 0 && <Divider />}
                <div className="flex w-full items-center gap-2 py-3">
                  <Illust name="gear" size={22} />
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <p className="text-ink text-[15px] leading-tight font-bold">{project.title}</p>
                    <p className="text-muted text-[12px] leading-tight">
                      운영진 {admins.length}명
                      {admins.length > 0 && ` · ${admins.map((a) => a.name).join(', ')}`}
                    </p>
                  </div>
                  <ChevronIcon />
                </div>
              </Fragment>
            )
          })}
        </Card>

        <Button variant="soft" onClick={() => setCreating(true)}>
          + 프로젝트 분류 만들기
        </Button>
      </AdminContent>

      <AssignSheet
        member={selected}
        isNew={selected ? isNewMember(selected) : false}
        onClose={() => setSelected(null)}
      />
      <CreateProjectSheet open={creating} onClose={() => setCreating(false)} />
    </>
  )
}

function ProjectHeaderRow({
  project,
  count,
  expanded,
  onToggle,
  className = '',
}: {
  project: ProjectCategory
  count: number
  expanded: boolean
  onToggle: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      className={`flex w-full items-center gap-1.5 text-left ${className}`}
    >
      <Illust name="folder" size={22} />
      <span className="text-ink text-[15px] leading-tight font-bold">{project.title}</span>
      <span className="text-muted text-[13px] leading-none font-medium">{count}명</span>
      <span className="flex-1" />
      <span className="text-muted text-[12px] leading-none font-bold">{expanded ? '▴' : '▾'}</span>
    </button>
  )
}
