import { Separator } from "@/components/ui/separator"
import type { Section } from "@/types/section"
import { type FC } from "react"

export const CourseContent: FC<Section> = ({title, order, readingTime}) => {
  return (
    <div className="bg-stone-900 w-full h-8 p-2 flex items-center rounded-sm gap-4 justify-around px-4">
      <h1 className="text-center justify-self-center">{order}</h1>
      <Separator className="w-8" orientation="vertical"></Separator>
      <h1 className="grow line-clamp-1">{title}</h1>
      <Separator className="w-8" orientation="vertical"></Separator>
      <p className="text-xs text-nowrap text-stone-200">{readingTime} Minutes</p>
    </div>
  )
}