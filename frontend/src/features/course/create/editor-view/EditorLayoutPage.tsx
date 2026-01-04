
import { Outlet, useParams } from "react-router";
import { useCourse } from "../../hooks/course/useCourse";
import { useSections } from "../../hooks/section/useGetSections";
import { useAuth } from "@/providers/AuthProvider";
import { useCoursesByUser } from "../../hooks/course/useCoursesByUser";
import { SectionList } from "./SectionList";

export const EditorLayout = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const courseQuery = useCourse(courseId);
  const sectionsQuery = useSections(courseId);
  const userCoursesQuery = useCoursesByUser(user?.id);

  const course = courseQuery.data?.data;
  const sections = sectionsQuery.data ?? [];
  const userCourses = userCoursesQuery.data?.data ?? [];
  const otherCourses = userCourses.filter((c: any) => c?.courseId !== courseId);

  // Create date from course creation date
  const date = course?.createdAt ? new Date(course.createdAt) : null;

  return (
    <div className="flex flex-col lg:flex-row text-white 2xl:mx-20 mx-0 h-full">
      <SectionList sections={sections} courseId={courseId!} courseTitle={course?.courseName || 'Untitled Course'} />

      <div className="flex-1 lg:pt-16">
        <Outlet
          context={{
            course,
            date,
            otherCourses,
            user,
            sections,
          }}
        />
      </div>
    </div>
  );
};
