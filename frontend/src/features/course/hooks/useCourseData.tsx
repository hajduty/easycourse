import { useParams } from "react-router";
import { useCourse } from "../hooks/useCourse";
import { useSections } from "../hooks/useSection";
import { useCoursesByUser } from "../hooks/useCoursesByUser";

export const useCourseData = (courseIdFromParam?: string) => {
  const { courseId: paramId } = useParams();
  const courseId = courseIdFromParam ?? paramId;

  // Fetch course
  const courseQuery = useCourse(courseId);
  const course = courseQuery.data?.data;

  // Fetch sections
  const sectionsQuery = useSections(courseId);
  const sections = sectionsQuery.data ?? [];

  // Fetch creator's other courses
  const creatorCoursesQuery = useCoursesByUser(course?.createdById);
  const creatorCourses = creatorCoursesQuery.data?.data ?? [];

  const otherCourses = course ? creatorCourses.filter((c: { courseId: string; }) => c.courseId !== course.courseId) : [];

  // Total reading time
  const totalTime = sections.reduce((sum, s) => sum + (s.readingTime ?? 0), 0);

  // Course creation date
  const date = course ? new Date(course.createdAt) : null;

  return {
    course,
    sections,
    otherCourses,
    totalTime,
    date,
    isLoading: courseQuery.isLoading || sectionsQuery.isLoading || creatorCoursesQuery.isLoading,
    isError: courseQuery.isError || sectionsQuery.isError || creatorCoursesQuery.isError,
  };
};
