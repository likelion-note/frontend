import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link, Navigate, useLocation, useSearchParams } from 'react-router'

import backIcon from '@/assets/meeting/history-back.svg'
import grid from '@/assets/guide/grid-bg.svg'
import { TaskChecklist } from '@/components/common/TaskChecklist'
import { BackHeader, ScreenContent } from '@/components/layout/Screen'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { getGuideResources, getWeeklyGuide } from '@/features/guide/api'
import { GuideIllustration } from '@/features/guide/components/GuideIllustration'
import { GuideOperatorMessage } from '@/features/guide/components/GuideOperatorMessage'
import { GuideResourceCard } from '@/features/guide/components/GuideResourceCard'
import { GuideResourcesSheet } from '@/features/guide/components/GuideResourcesSheet'
import { guideParts } from '@/features/guide/mock/data'
import { useGuideCompletion } from '@/features/guide/useGuideCompletion'
import {
  contextSearch,
  ideaMeetingPath,
  normalizePart,
  useGuideContext,
} from '@/features/guide/useGuideContext'
import { useHomeMode } from '@/features/home/useHomeMode'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/lib/cn'

export function PartGuidePage() {
  const mode = useHomeMode()
  const context = useGuideContext()
  const location = useLocation()
  const [params, setParams] = useSearchParams()
  const part = normalizePart(params.get('part')) ?? context.assignedPart ?? 'PM'
  const requestedWeek = Number(params.get('week'))
  const week = context.weeks.includes(requestedWeek) ? requestedWeek : context.currentWeek
  const enabled = mode === 'project-active' && !!context.assignedPart
  const guide = useQuery({
    queryKey: ['guide', 'weekly', part, week],
    queryFn: () => getWeeklyGuide(part, week),
    enabled,
  })
  const resources = useQuery({
    queryKey: ['guide', 'resources', part, week],
    queryFn: () => getGuideResources(part, week),
    enabled,
  })
  const completion = useGuideCompletion(context.userKey, part, week, guide.data?.tasks ?? [])
  const toast = useToast()
  const [resourcesOpen, setResourcesOpen] = useState(() => params.get('resources') === 'proposals')
  const [previewResourceId, setPreviewResourceId] = useState<string | null>(null)
  const [resourceIds, setResourceIds] = useState<string[] | null>(null)
  if (!enabled) return <Navigate to={`/home${contextSearch(location.search)}`} replace />

  function choose(key: string, value: string) {
    setParams(
      (current) => {
        const next = new URLSearchParams(current)
        next.set(key, value)
        next.delete('resources')
        return next
      },
      { replace: true },
    )
    setResourcesOpen(false)
    setResourceIds(null)
    setPreviewResourceId(null)
  }
  function openResource(id: string) {
    setPreviewResourceId(id)
    setResourcesOpen(true)
  }
  function closeResources() {
    setResourcesOpen(false)
    if (params.has('resources'))
      setParams(
        (current) => {
          const next = new URLSearchParams(current)
          next.delete('resources')
          return next
        },
        { replace: true },
      )
  }
  function toggle(id: string) {
    const error = completion.toggle(id)
    if (error) toast(error)
  }
  const ids =
    resourceIds ??
    guide.data?.tasks.find((task) => task.action?.kind === 'resources')?.action?.resourceIds ??
    []
  const featuredResources =
    resources.data?.filter((resource) => guide.data?.featuredResourceIds.includes(resource.id)) ??
    []
  const listedResources = resources.data?.filter((resource) => ids.includes(resource.id)) ?? []

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="bg-paper shrink-0">
        <BackHeader
          title="파트 가이드"
          backTo={`/home${contextSearch(location.search)}`}
          backIcon={<img src={backIcon} width={24} height={24} alt="" />}
        />
      </div>
      <ScreenContent
        className="bg-paper [background-size:390px_auto] [background-position:top_center] [background-repeat:repeat-y] pt-2 pb-[max(28px,env(safe-area-inset-bottom))]"
        style={{ backgroundImage: `url(${grid})` }}
      >
        <div role="group" aria-label="파트 선택" className="flex flex-wrap items-start gap-1.5">
          {guideParts.map(({ id, label }) => (
            <Chip
              key={id}
              selected={part === id}
              onClick={() => choose('part', id)}
              className={cn(
                'px-3 text-[13px] leading-[16px]',
                part !== id && 'border-[#f1e6da] bg-white',
              )}
            >
              {label}
            </Chip>
          ))}
        </div>
        <label className="border-input-line relative flex h-[50px] items-center border-b-[1.4px] px-0.5">
          <GuideIllustration name="calendar" size={24} />
          <select
            aria-label="주차 선택"
            value={week}
            onChange={(event) => choose('week', event.target.value)}
            className="focus-visible:outline-accent h-full min-w-0 flex-1 appearance-none bg-transparent pr-5 text-[14px] leading-[17px] outline-none focus-visible:outline-2"
          >
            {context.weeks.map((value) => (
              <option key={value} value={value}>
                {value}주차{value === context.currentWeek ? ' (이번 주)' : ''}
              </option>
            ))}
          </select>
          <span
            aria-hidden="true"
            className="text-muted pointer-events-none absolute right-0.5 text-[13px] leading-[16px] font-bold"
          >
            ▾
          </span>
        </label>
        {guide.isPending ? (
          <p role="status" className="text-muted text-[13px]">
            가이드를 불러오고 있어요.
          </p>
        ) : guide.isError ? (
          <div role="alert">
            <p>가이드를 불러오지 못했어요.</p>
            <button
              type="button"
              onClick={() => void guide.refetch()}
              className="text-accent-deep mt-2 underline"
            >
              다시 시도
            </button>
          </div>
        ) : !guide.data ? (
          <p className="text-muted text-[13px]">아직 등록된 주차 가이드가 없어요.</p>
        ) : (
          <>
            <Card
              as="section"
              aria-label={`${guideParts.find((item) => item.id === part)?.label} ${week}주차 할 일`}
            >
              {completion.tasks.length === 0 && (
                <p className="text-muted text-[13px]">이번 주에 등록된 할 일이 없어요.</p>
              )}
              <TaskChecklist
                tasks={completion.tasks}
                idPrefix={`guide-${part}-${week}`}
                highlightToday={false}
                dueLabel={(task) => task.weekday}
                onToggle={toggle}
                renderAction={(task) =>
                  task.action &&
                  (task.action.kind === 'meeting' ? (
                    <Link
                      to={ideaMeetingPath(location.search)}
                      className="text-accent-deep mt-[3px] block text-left text-[12px] leading-[14px] font-bold"
                    >
                      {task.action.label}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewResourceId(null)
                        setResourceIds(task.action?.resourceIds ?? [])
                        setResourcesOpen(true)
                      }}
                      className="text-accent-deep mt-[3px] block text-left text-[12px] leading-[14px] font-bold"
                    >
                      {task.action.label}
                    </button>
                  ))
                }
              />
            </Card>
            {resources.isPending ? (
              <p role="status" className="text-muted text-[13px]">
                자료를 불러오고 있어요.
              </p>
            ) : resources.isError ? (
              <div role="alert">
                <p>자료를 불러오지 못했어요.</p>
                <button
                  type="button"
                  onClick={() => void resources.refetch()}
                  className="text-accent-deep mt-2 underline"
                >
                  자료 다시 시도
                </button>
              </div>
            ) : !featuredResources.length ? (
              <p className="text-muted text-[13px]">아직 등록된 자료가 없어요.</p>
            ) : (
              featuredResources.map((resource) => (
                <GuideResourceCard key={resource.id} resource={resource} onSelect={openResource} />
              ))
            )}
            <GuideOperatorMessage message={guide.data.operatorMessage} />
          </>
        )}
      </ScreenContent>
      <GuideResourcesSheet
        open={resourcesOpen}
        onClose={closeResources}
        resources={listedResources}
        resourceId={previewResourceId}
        resourceTitle={resources.data?.find((resource) => resource.id === previewResourceId)?.title}
        onSelect={openResource}
        pending={resources.isPending}
        failed={resources.isError}
        onRetry={() => void resources.refetch()}
      />
    </div>
  )
}
