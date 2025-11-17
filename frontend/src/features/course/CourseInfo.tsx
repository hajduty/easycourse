import { CourseContent } from "./components/CourseContent"
import { Link } from "react-router";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useCourseData } from "./hooks/course/useCourseData";
import { useDeleteSection } from "./hooks/section/useDeleteSection";

export const CourseInfo = () => {
  const { user } = useAuth();
  const { course, date, otherCourses, sections, totalTime } = useCourseData();

  const deleteSection = useDeleteSection(course?.courseId!);

  const handleDelete = (sectionId: string) => {
    deleteSection.mutate(sectionId);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen text-white">
      {/* Left sidebar: Course content */}
      <div className="md:w-1/5 w-full border-b md:border-b-0 md:border-r p-6 md:p-8 flex flex-col">
        <h1 className="font-semibold text-lg">Course content</h1>
        <p className="pb-4 text-sm text-stone-300">{totalTime} minutes total</p>
        <div className="flex flex-col gap-2 md:gap-4">
          {sections.map((val, index) => (
            <Link key={index} to={`/course/${course?.courseId}/section/${val.sectionId}`}>
              <CourseContent {...val} canDelete={false} onClick={() => handleDelete(val.sectionId!)} />
            </Link>
          ))}
        </div>
      </div>

      {/* Main content: Course info */}
      <div className="md:w-3/5 w-full border-b md:border-b-0 md:border-r p-6 md:p-8 flex flex-col gap-6">
        <div className="w-full h-72 bg-stone-800 rounded-xl overflow-hidden">
          <img
            draggable={false}
            src={"https://picsum.photos/600/400"}
            alt="Course cover"
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-3xl font-bold">{course?.courseName}</h1>
        <p className="text-stone-300 leading-relaxed">{course?.courseDescription}</p>
        <p className="text-sm text-stone-500">Published: {date?.toLocaleDateString()}</p>

        {course?.createdById === user?.id && (
          <Link to={`/course/editor/${course?.courseId}`} className="self-start">
            <Button variant="secondary" className="flex items-center gap-2 cursor-pointer">
              <Pencil /> Go to editor
            </Button>
          </Link>
        )}
      </div>

      {/* Right sidebar: Creator info & other courses */}
      <div className="md:w-1/5 w-full p-6 md:p-8 flex flex-col gap-6">
        <div>
          <p className="font-semibold mb-2">Created by</p>
          <div className="flex items-center gap-4 bg-stone-900 p-3 rounded">
            <img
              draggable={false}
              src={"https://picsum.photos/150"}
              alt="Creator"
              className="w-16 h-16 rounded"
            />
            <div>
              <h2 className="font-semibold text-md">John Doe</h2>
              <p className="text-xs text-stone-400">4 courses</p>
              <p className="text-xs text-stone-500">Joined 2025-11-15</p>
            </div>
          </div>

          {otherCourses?.length > 0 && <h2 className="pt-6 font-semibold">More by this user</h2>}

          <div className="flex flex-col gap-3 mt-2">
            {otherCourses?.slice(0, 4).map((val) => (
              <Link key={val.courseId} to={`/course/${val.courseId}`}>
                <div className="flex items-center gap-3 bg-stone-900 p-3 rounded hover:bg-stone-800 transition">
                  <img
                    draggable={false}
                    src={"https://picsum.photos/150"}
                    alt={val.courseName}
                    className="w-16 h-16 rounded"
                  />
                  <div className="flex flex-col overflow-hidden">
                    <h2 className="font-semibold text-md line-clamp-1">{val.courseName}</h2>
                    <p className="text-xs text-stone-400 line-clamp-1">{val.courseDescription}</p>
                    <p className="text-xs text-stone-500 line-clamp-1">{val.participantCount} participants</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
