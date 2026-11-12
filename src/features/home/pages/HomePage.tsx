import { BottomNav } from '@/components/common/BottomNav'
import { BeforePartHome } from '@/features/home/components/BeforePartHome'
import { ProjectActiveHome } from '@/features/home/components/ProjectActiveHome'
import { ProjectInactiveHome } from '@/features/home/components/ProjectInactiveHome'
import { useHomeData } from '@/features/home/useHomeData'

export function HomePage() {
  const { mode, data, beforePartData, inactiveData, toggleTodo, toggleHelpful } = useHomeData()

  function renderHome() {
    switch (mode) {
      case 'before-part-assignment':
        return <BeforePartHome data={beforePartData} />
      case 'project-active':
        return (
          <ProjectActiveHome
            data={data}
            onToggleTodo={toggleTodo}
            onToggleHelpful={toggleHelpful}
          />
        )
      case 'project-inactive':
        return <ProjectInactiveHome data={inactiveData} />
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {renderHome()}
      <BottomNav meetingAvailable={mode === 'project-active'} />
    </div>
  )
}
