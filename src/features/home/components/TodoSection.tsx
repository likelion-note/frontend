import { TaskChecklist } from '@/components/common/TaskChecklist'
import ring from '@/assets/home/progress-ring.svg'
import halfRing from '@/assets/home/progress-half.svg'
import { Card } from '@/components/ui/Card'
import { HomeAction } from '@/features/home/components/HomeAction'
import type { HomeAction as Action, Todo } from '@/features/home/types'

export function TodoSection({
  todos,
  action,
  onToggle,
}: {
  todos: Todo[]
  action: Action
  onToggle: (id: string) => void
}) {
  const completed = todos.filter((todo) => todo.isCompleted).length
  const ratio = todos.length ? completed / todos.length : 0
  return (
    <Card as="section" aria-labelledby="todo-heading" className="flex flex-col gap-0.5">
      <div className="flex items-center gap-3 pb-1.5">
        <div
          role="img"
          aria-label={`${todos.length}개 중 ${completed}개 완료`}
          className="relative size-[46px] shrink-0"
        >
          <img src={ring} width={46} height={46} alt="" className="absolute inset-0" />
          {ratio === 0.5 ? (
            <img src={halfRing} width={23} height={46} alt="" className="absolute top-0 right-0" />
          ) : (
            <span
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(var(--color-accent) ${ratio * 360}deg, transparent 0)`,
                mask: 'radial-gradient(circle, transparent 18px, black 19px)',
              }}
            />
          )}
          <span className="absolute inset-0 flex items-center justify-center text-[12px] leading-[14px] font-bold">
            {completed}/{todos.length}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h2 id="todo-heading" className="text-[16px] leading-[19px] font-bold">
            오늘 할 일
          </h2>
          <p className="text-muted mt-0.5 text-[12px] leading-[14px]">
            {todos.length}개 중 {completed}개 완료
          </p>
        </div>
        <HomeAction
          action={action}
          className="text-muted shrink-0 text-[13px] leading-[16px] font-medium"
        />
      </div>
      <TaskChecklist
        tasks={todos}
        idPrefix="home-todo"
        onToggle={onToggle}
        renderAction={(todo) =>
          todo.action && (
            <HomeAction
              action={todo.action}
              className="text-accent-deep mt-[3px] block text-left text-[12px] leading-[14px] font-bold"
            />
          )
        }
      />
    </Card>
  )
}
