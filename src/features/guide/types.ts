import type { HomeAction, Todo } from '@/features/home/types'

export type GuidePart = 'PM' | 'DESIGN' | 'FRONTEND' | 'BACKEND'
export interface GuideTask extends Todo {
  weekday: string
  action?: HomeAction & { kind: 'meeting' | 'resources'; resourceIds?: string[] }
}
export interface WeeklyGuide {
  id: string
  part: GuidePart
  week: number
  tasks: GuideTask[]
  featuredResourceIds: string[]
  operatorMessage: { text: string; image?: { src: string; width: number; height: number } }
}
export interface GuideResource {
  id: string
  part: GuidePart
  week: number
  title: string
  description: string
  teamName: string
  fileType: 'pdf' | 'image' | 'link' | 'other'
  fileUrl: string | null
  previewTitle?: string
  previewDescription?: string
  previewItems?: string[]
}
