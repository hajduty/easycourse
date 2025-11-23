
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
    <div className="flex flex-col lg:flex-row w-full h-full">
      <SectionList sections={sections} courseId={courseId!} courseTitle={course?.courseName!}/>

      <div className="flex-1 h-full">
        <Outlet context={{course, sections}}/>
      </div>
    </div>
  );
};