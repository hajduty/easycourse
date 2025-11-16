import { useQuery } from "@tanstack/react-query";
import { GetCourseById, GetSections, UpdateCourse } from "../api";
import { useParams, useSearchParams } from "react-router";
import { CourseContent } from "../components/CourseContent";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Ghost, Pencil } from "lucide-react";

export const CourseEditor = () => {
  const [searchParams] = useSearchParams();
  const { courseId } = useParams();
  const sectionsQuery = useQuery({
    queryKey: ["sections", courseId],
    queryFn: () => GetSections(courseId!),
    enabled: !!courseId,
  });

  console.log(courseId);

  const courseQuery = useQuery({
    queryKey: ["courseById", courseId],
    queryFn: () => GetCourseById(courseId!),
    enabled: !!courseId,
  });

  const sections = sectionsQuery.data?.data ?? [];
  const course = courseQuery.data?.data;
  const date = new Date(course?.createdAt!)

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const editingParam = searchParams.get("isEditing");
    if (editingParam) {
      startEditing();
    }
  }, [searchParams]);

  const [saving, setSaving] = useState(false);

  const startEditing = () => {
    if (!course) return;
    setTitle(course.courseName);
    setDescription(course.courseDescription);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const saveChanges = async () => {
    setSaving(true);

    await UpdateCourse(
      {
        courseName: title,
        courseDescription: description,
        sections: []
      },
      course!.courseId
    );

    setSaving(false);
    setIsEditing(false);

    courseQuery.refetch();
  };

  return (
    <div className="h-screen w-screen">
      <div className="relative flex flex-col md:flex-row w-full h-full">
        <div className="sticky flex-1 h-full border-r p-8 flex flex-col pt-16">
          <h1 className="font-semibold">Course content</h1>
          <h1 className="pb-6 text-sm text-stone-300">{ } minutes total</h1>
          <div className="flex flex-col gap-4">
            {sections.map((val, index) => (
              <CourseContent key={index} {...val}></CourseContent>
            ))}
            <Button className="cursor-pointer" variant={"secondary"}>Add new section</Button>
          </div>
        </div>
        <div className="flex flex-col gap-6 flex-5 py-16 px-8">

          <div className="relative w-full h-72 rounded-xl overflow-hidden group">
            <img
              src="https://picsum.photos/150"
              className="w-full h-full object-cover"
              draggable={false}
            />

            {!isEditing && (
              <button onClick={() => startEditing()} className="absolute top-4 right-4 p-2 rounded-full bg-black/40 backdrop-blur-md'
               hover:bg-black/60 transition border border-white/10 shadow-lg">
                <Pencil className="w-5 h-5 text-white" />
              </button>
            )}
          </div>

          {isEditing ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-3xl font-bold bg-stone-900 border border-stone-700 p-2 rounded-lg"
            />
          ) : (
            <h1 className="text-3xl font-bold">{course?.courseName}</h1>
          )}

          {isEditing ? (
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-stone-900 border border-stone-700 p-3 rounded-lg"
            />
          ) : (
            <p className="text-stone-300">{course?.courseDescription}</p>
          )}

          {!isEditing ? (
            <Button onClick={startEditing} className="self-start" variant={'secondary'}>
              <Pencil></Pencil>
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={saveChanges} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button variant="secondary" onClick={cancelEditing}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}