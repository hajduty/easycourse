import { useOutletContext } from "react-router";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useUpdateCourse } from "../hooks/course/useUpdateCourse";
import { Eye, EyeOff, Pencil } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const CourseEditor = () => {
  const { course } = useOutletContext<any>();
  const updateCourse = useUpdateCourse();

  const [title, setTitle] = useState(course.courseName);
  const [description, setDescription] = useState(course.courseDescription);
  const [isEditing, setIsEditing] = useState(false);
  const [isPublic, setIsPublic] = useState(course.isPublic);

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

  return (
    <div className="flex flex-col gap-6 text-white py-8">
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
        <Button onClick={() => setIsEditing(true)} className="w-fit self-end">
          <Pencil /> Edit
        </Button>
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
