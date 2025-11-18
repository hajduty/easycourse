import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator"
import type { Section } from "@/types/section"
import { Pencil, Trash } from "lucide-react";
import { useState, type FC } from "react"
import { useParams } from "react-router";

export interface SectionItem extends Section {
  onDelete: () => void;
  canDelete: boolean;
  onEdit: (newTitle: string) => void;
}

export const CourseContent: FC<SectionItem> = ({ onDelete, order, title, readingTime, canDelete, sectionId, onEdit }) => {
  const {sectionId: paramSectionId} = useParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<boolean>();
  const [tempTitle, setTempTitle] = useState(title);

  const textColorClass = !canDelete || sectionId === paramSectionId
    ? "text-white"
    : "text-stone-500";

  const bgClass = sectionId === paramSectionId ? "bg-stone-900" : "bg-stone-900/40";

  const finishEditing = () => {
    setEditing(false);
    if (tempTitle !== title) {
      onEdit?.(tempTitle!);
    }
  };

  return (
    <div
      className={`w-full h-8 p-2 flex items-center rounded-sm gap-4 justify-around px-4 group relative border hover:bg-stone-800 transition ${textColorClass} ${bgClass}`}
    >
      <h1 className="text-center justify-self-center">{order}</h1>
      <Separator className="w-8" orientation="vertical" />

      {/* TITLE SECTION */}
      {!editing ? (
        <h1
          className="grow cursor-pointer line-clamp-1"
          onClick={() => {
            if (!canDelete) return;
            setTempTitle(title);
          }}
        >
          {title}
        </h1>
      ) : (
        <Input
          autoFocus
          value={tempTitle}
          onChange={(e) => setTempTitle(e.target.value)}
          onBlur={finishEditing}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          onKeyDown={(e) => {
            if (e.key === "Enter") finishEditing();
            if (e.key === "Escape") {
              setTempTitle(title);
              setEditing(false);
            }
          }}
          className="px-2 h-auto border-0 bg-transparent focus:bg-transparent dark:bg-transparent grow mr-4 focus:ring-0 focus:outline-0 focus-visible:ring-0"
        />
      )}

      {/* Pencil icon ONLY when editing is available */}
      {canDelete && !editing && (
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute right-8 text-stone-400 hover:text-stone-200 transition"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setEditing(true);
          }}
        >
          <Pencil />
        </Button>
      )}

      {/* Trash */}
      {canDelete && (
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              className="absolute right-0 text-stone-500 group-hover:text-red-200 transition-opacity cursor-pointer rounded-sm hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsDialogOpen(true);
              }}
              variant="ghost"
              size="icon-sm"
            >
              <Trash />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent
            onClick={(e) => e.stopPropagation()}
            className="text-white"
          >
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Section?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this section? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                Cancel
              </AlertDialogCancel>
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
      )}

      {/* Reading time when NOT deletable */}
      {!canDelete && (
        <>
          <Separator className="w-8" orientation="vertical" />
          <p className="text-xs text-nowrap text-stone-200">
            {readingTime} Minutes
          </p>
        </>
      )}
    </div>
  );
};