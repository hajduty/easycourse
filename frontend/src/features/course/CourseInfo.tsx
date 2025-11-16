import { useQuery } from "@tanstack/react-query";
import { Navbar } from "../home/components/Navbar"
import { CourseContent } from "./components/CourseContent"
import { GetCourseById, GetCoursesByUserId, GetSections } from "./api";
import { Link, useParams } from "react-router";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export const CourseInfo = () => {
  const { user } = useAuth();
  const { courseId } = useParams();

  const sectionsQuery = useQuery({
    queryKey: ["sections", courseId],
    queryFn: () => GetSections(courseId!),
    enabled: !!courseId,
  });

  const courseQuery = useQuery({
    queryKey: ["courseById", courseId],
    queryFn: () => GetCourseById(courseId!),
    enabled: !!courseId,
  });

  const sections = sectionsQuery.data?.data ?? [];
  const course = courseQuery.data?.data;

  const userCoursesQuery = useQuery({
    queryKey: ["coursesByUserId", course?.createdById],
    queryFn: () => GetCoursesByUserId(course?.createdById!),
    enabled: !!courseId,
  });

  const creatorCourses = userCoursesQuery.data?.data ?? [];
  const updatedCourses = creatorCourses.filter(
    (c) => c.courseId !== course!.courseId
  );

  const totalTime = sections.reduce((sum, s) => sum + s.readingTime, 0);
  const date = new Date(course?.createdAt!)

  return (
    <div className="h-screen text-white">
      <Navbar />
      <div className="relative flex flex-col md:flex-row w-full h-full">
        <div className="flex-1 h-full border-r p-8 flex flex-col pt-16">
          <h1 className="font-semibold">Course content</h1>
          <h1 className="pb-6 text-sm text-stone-300">{totalTime} minutes total</h1>
          <div className="flex flex-col gap-4">
            {sections.map((val, index) => (
              <Link to={`/course/${course?.courseId}/section/${val.sectionId}`}>
                <CourseContent key={index} {...val}></CourseContent>
              </Link>
            ))}
          </div>
        </div>

        <div className=" flex flex-col gap-6 flex-3 border-r border-stone-800 py-16 px-8">
          <div className="w-full h-72 bg-stone-800 rounded-xl">
            <img
              draggable={false}
              src={"https://picsum.photos/150"}
              alt={"hello"}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold">{course?.courseName}</h1>
          <p className="text-stone-300 leading-relaxed">{course?.courseDescription}</p>

          <p className="text-sm text-stone-500">
            Published: {date.toLocaleDateString()}
          </p>
          {course?.createdById == user?.id &&
            <Link to={`/course/editor/${course?.courseId}?isEditing=true`} className="self-start">
              <Button className="self-start cursor-pointer" variant={'secondary'}>
                <Pencil></Pencil>
                Edit
              </Button>
            </Link>
          }
        </div>

        <div className="flex flex-col gap-4 flex-1 border-r border-stone-800 py-16 px-8">
          <div className="flex flex-col gap-2">
            <p className="font-semibold">Created by</p>
            <div className="flex flex-row bg-stone-900 w-full rounded-sm gap-4 items-center">
              <div>
                <img
                  draggable={false}
                  src={"https://picsum.photos/150"}
                  alt={"hello"}
                  className="w-18 h-18 rounded-r rounded-sm"
                />
              </div>
              <div>
                <h2 className="font-semibold text-md">John Doe</h2>
                <p className="text-xs text-stone-400">4 courses</p>
                <p className="text-xs text-stone-500">Joined 2025-11-15</p>
              </div>
            </div>
            {!!creatorCourses.length && (
              <h2 className="pt-8 font-semibold">More by this user</h2>
            )}
            {updatedCourses.slice(0, 4).map((val, index) => (
              <Link to={`/course/${val.courseId}`} key={index}>
                <div className="flex flex-row bg-stone-900 grow rounded-sm gap-4 items-center w-full mb-4 cursor-pointer">
                  <div className="flex flex-row gap-4 items-center">
                    <img
                      draggable={false}
                      src={"https://picsum.photos/150"}
                      alt={"hello"}
                      className="w-18 h-18 rounded-r rounded-sm"
                    />
                    <div>
                      <h2 className="font-semibold text-md line-clamp-1">{val.courseName}</h2>
                      <p className="text-xs text-stone-400 line-clamp-1">{val.courseDescription}</p>
                      <p className="text-xs text-stone-500 line-clamp-1">{val.participantCount} participants</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}