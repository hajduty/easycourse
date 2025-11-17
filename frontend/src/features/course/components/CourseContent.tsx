import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import type { Section } from "@/types/section"
import { Trash } from "lucide-react";
import { useState, type FC } from "react"
import { useParams } from "react-router";

export interface SectionItem extends Section {
  onDelete: () => void;
  canDelete: boolean;
}

export const CourseContent: FC<SectionItem> = ({ onDelete, order, title, readingTime, canDelete, sectionId }) => {
  const {sectionId: paramSectionId} = useParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const textColorClass = !canDelete || sectionId === paramSectionId
    ? "text-white"
    : "text-stone-500";

  const bgClass = sectionId === paramSectionId ? "bg-stone-900" : "bg-stone-900/40";

  return (
    <div className={` w-full h-8 p-2 flex items-center rounded-sm gap-4 justify-around px-4 group relative border hover:bg-stone-800 transition ${textColorClass} ${bgClass} `}>
      <h1 className="text-center justify-self-center">{order}</h1>
      <Separator className="w-8" orientation="vertical"></Separator>
      <h1 className="grow line-clamp-1">{title}</h1>
      {!canDelete && <Separator className="w-8" orientation="vertical"></Separator>}
      {!canDelete && <p className="text-xs text-nowrap text-stone-200">{readingTime} Minutes</p>}
      {canDelete &&
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              className="absolute right-0 text-stone-500 group-hover:text-red-200 transition-opacity cursor-pointer rounded-sm hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsDialogOpen(true);
              }}
              variant={'ghost'}
              size={'icon-sm'}
            >
              <Trash></Trash>
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent onClick={(e) => {e.stopPropagation()}} className="text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Section?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this section? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <AlertDialogCancel onClick={(e) => { e.stopPropagation()}}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  onDelete?.();
                  e.stopPropagation();
                  e.preventDefault();
                  setIsDialogOpen(false);
                }}
              >
                Delete
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      }
    </div>
  )
}