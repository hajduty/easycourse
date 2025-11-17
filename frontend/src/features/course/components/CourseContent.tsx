import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import type { Section } from "@/types/section"
import { Trash } from "lucide-react";
import { useState, type FC } from "react"

export interface SectionItem extends Section {
  onClick: () => void;
  canDelete: boolean;
}

export const CourseContent: FC<SectionItem> = ({ onClick, order, title, readingTime, canDelete }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="bg-stone-900 w-full h-8 p-2 flex items-center rounded-sm gap-4 justify-around px-4 group relative border hover:bg-stone-800 transition">
      <h1 className="text-center justify-self-center">{order}</h1>
      <Separator className="w-8" orientation="vertical"></Separator>
      <h1 className="grow line-clamp-1">{title}</h1>
      {!canDelete && <Separator className="w-8" orientation="vertical"></Separator>}
      {!canDelete && <p className="text-xs text-nowrap text-stone-200">{readingTime} Minutes</p>}
      {canDelete &&
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              className="absolute right-0 opacity-0 group-hover:opacity-100 text-red-400 transition-opacity cursor-pointer rounded-sm hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                setIsDialogOpen(true);
              }}
              variant={'ghost'}
              size={'icon-sm'}
            >
              <Trash></Trash>
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Section?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this section? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  onClick?.();
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