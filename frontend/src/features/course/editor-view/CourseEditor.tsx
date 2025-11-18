import { useOutletContext } from "react-router";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useUpdateCourse } from "../hooks/course/useUpdateCourse";
import { Pencil } from "lucide-react";

export const CourseEditor = () => {
  const { course } = useOutletContext<any>();
  const updateCourse = useUpdateCourse();

  const [title, setTitle] = useState(course.courseName);
  const [description, setDescription] = useState(course.courseDescription);
  const [isEditing, setIsEditing] = useState(false);

  const save = () => {
    updateCourse.mutate({
      courseId: course.courseId,
      data: { courseName: title, courseDescription: description }
    });
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-6 text-white py-8">
      <div className="relative w-full h-72 md:ounded-xl overflow-hidden group">
        <img
          src="https://picsum.photos/150"
          className="w-full h-full object-cover"
          draggable={false}
        />

        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="absolute top-4 right-4 p-2 rounded-full bg-black/40 backdrop-blur-md'
               hover:bg-black/60 transition border border-white/10 shadow-lg">
            <Pencil className="w-5 h-5 text-white" />
          </button>
        )}
      </div>
      {/* TITLE */}
      {isEditing ? (
        <Input value={title} onChange={e => setTitle(e.target.value)} />
      ) : (
        <h1 className="text-3xl font-bold">{course.courseName}</h1>
      )}

      {/* DESCRIPTION */}
      {isEditing ? (
        <Textarea value={description} onChange={e => setDescription(e.target.value)} />
      ) : (
        <p className="text-stone-300">{course.courseDescription}</p>
      )}

      {/* BUTTONS */}
      {!isEditing ? (
        <Button onClick={() => setIsEditing(true)} className="w-fit self-end" ><Pencil></Pencil>Edit</Button>
      ) : (
        <div className="flex gap-2">
          <Button onClick={save}>Save</Button>
          <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
        </div>
      )}
    </div>
  );
};
