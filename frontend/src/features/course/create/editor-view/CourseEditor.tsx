import { useNavigate, useOutletContext } from "react-router";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useUpdateCourse } from "../../hooks/course/useUpdateCourse";
import { Eye, EyeOff, Pencil, Trash } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useDeleteCourse } from "../../hooks/course/useDeleteCourse";

export const CourseEditor = () => {
  const { course } = useOutletContext<any>();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState(course.courseName);
  const [description, setDescription] = useState(course.courseDescription);
  const [isEditing, setIsEditing] = useState(false);
  const [isPublic, setIsPublic] = useState(course.isPublic);
  
  const updateCourse = useUpdateCourse();

  const save = () => {
    updateCourse.mutate({
      courseId: course.courseId,
      data: {
        courseName: title,
        courseDescription: description,
        isPublic: isPublic,
      },
    });
    setIsEditing(false);
  };

  const deleteCourse = useDeleteCourse();

  const handleDeleteCourse = async () => {
    await deleteCourse.mutateAsync(course.courseId);
    navigate("/course/create");
  };

  return (
    <div className="flex flex-col gap-6 text-white py-8 mx-2 md:mx-8">
      {/* IMAGE */}
      <div className="relative w-full h-72 md:rounded-xl overflow-hidden">
        <img
          src="https://picsum.photos/150"
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* TITLE */}
      <div className="flex items-center justify-between w-full">
        {isEditing ? (
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        ) : (
          <h1 className="text-3xl font-bold">{course.courseName}</h1>
        )}
      </div>

      {/* DESCRIPTION */}
      {isEditing ? (
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      ) : (
        <p className="text-stone-300">{course.courseDescription}</p>
      )}

      {/* BUTTONS + VISIBILITY */}
      {!isEditing ? (
        <div className="flex gap-2 justify-end">
          <AlertDialog>
            <AlertDialogTrigger className="bg-red-400/60 hover:bg-red-400/50 transition px-2 rounded-md text-sm flex align-middle items-center gap-1 cursor-pointer">
            <Trash size={17}/>
            Delete
            </AlertDialogTrigger>
            <AlertDialogContent className="text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete course?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this course
                  and all sections related to it.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => {handleDeleteCourse()}}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button onClick={() => setIsEditing(true)} className="w-fit cursor-pointer">
            <Pencil /> Edit
          </Button>
        </div>
      ) : (
        <div className="flex gap-2 items-center">
          {/* PUBLIC/PRIVATE SELECT */}
          <Select value={isPublic ? "public" : "private"} onValueChange={(val) => setIsPublic(val === "public")}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" /> Public
                </div>
              </SelectItem>
              <SelectItem value="private">
                <div className="flex items-center gap-1">
                  <EyeOff className="w-4 h-4" /> Private
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* SAVE/CANCEL */}
          <Button onClick={() => save()}>Save</Button>
          <Button variant="secondary" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};
