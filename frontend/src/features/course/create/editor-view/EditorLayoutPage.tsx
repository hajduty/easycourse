
import { Spinner } from "@/components/ui/spinner";
import { Outlet, useParams } from "react-router";
import { useCourse } from "../../hooks/course/useCourse";
import { useSections } from "../../hooks/section/useGetSections";
import { SectionList } from "./SectionList";

export const EditorLayout = () => {
  const { courseId } = useParams();
  const courseQuery = useCourse(courseId);
  const sectionsQuery = useSections(courseId);

  if (courseQuery.isLoading || sectionsQuery.isLoading)
    return <Spinner />;

  const course = courseQuery.data?.data;
  const sections = sectionsQuery.data ?? [];

  return (
    <div className="flex flex-col lg:flex-row h-full 2xl:mx-20 mx-0 text-white lg:pt-12">
      <SectionList sections={sections} courseId={courseId!} courseTitle={course?.courseName!} />

      <div className="flex-1 h-full">
        <Outlet context={{ course, sections }} />
      </div>
    </div>
  );
};