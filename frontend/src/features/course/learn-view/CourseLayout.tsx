import { CourseContent } from "../components/CourseContent"
import { Link, Outlet, useParams } from "react-router";
import { useAuth } from "@/providers/AuthProvider";
import { useCourseData } from "../hooks/course/useCourseData";

export const CourseLayout = () => {
  const { user } = useAuth();
  const { course, date, otherCourses, sections, totalTime } = useCourseData();

  const { sectionId } = useParams();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen h-full text-white">
      {/* Desktop sidebar */}
      <div className="lg:w-1/5 w-1/4 hidden lg:flex flex-col border-b md:border-b-0 md:border-r p-6 md:p-8">
        <h1 className="font-semibold text-lg">Course content</h1>
        <p className="pb-4 text-sm text-stone-300">{totalTime} minutes total</p>
        <div className="flex flex-col gap-2 md:gap-4">
          {sections.map((val, index) => (
            <Link key={index} to={`/course/${course?.courseId}/section/${val.sectionId}`}>
              <CourseContent {...val} canDelete={false} onDelete={() => { }} onEdit={() => { }} />
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile / tablet horizontal sections */}
      <div className="lg:hidden w-full overflow-x-auto p-2">
        <div className="flex gap-2 h-full">
          {sections.map((val, index) => (
            <Link key={index} to={`/course/${course?.courseId}/section/${val.sectionId}`} className="shrink-0">
              <CourseContent {...val} canDelete={false} onDelete={() => { }} onEdit={() => { }} />
            </Link>
          ))}
        </div>
      </div>

      {/* Main content / Outlet */}
      <div className="flex-1 md:px-8 h-full">
        <Outlet
          context={{
            course,
            date,
            otherCourses,
            user,
            sections,
            totalTime,
          }}
        />
      </div>

      {/* Mobile / tablet horizontal sections */}
      {sectionId &&
        <div className="md:hidden w-full p-2 overflow-x-auto bg-stone-950">
          <div className="flex gap-2">
            {sections.map((val, index) => (
              <Link key={index} to={`/course/${course?.courseId}/section/${val.sectionId}`} className="shrink-0">
                <div className="p-2">
                  <CourseContent {...val} canDelete={false} onDelete={() => { }} onEdit={() => { }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      }
    </div>
  );
};