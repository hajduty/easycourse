import { CourseContent } from "../components/CourseContent"
import { Link, Outlet, useParams } from "react-router";
import { useAuth } from "@/providers/AuthProvider";
import { useCourseData } from "../hooks/course/useCourseData";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParticipantInfo } from "../hooks/participant/useGetParticipant";

export const CourseLayout = () => {
  const { user } = useAuth();
  const { course, date, otherCourses, sections, totalTime } = useCourseData();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);
  const { sectionId } = useParams();

  const participantInfo = useParticipantInfo(course?.courseId!, user?.id!);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const update = () => {
      const atTop = el.scrollTop <= 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

      setShowTop(!atTop);
      setShowBottom(!atBottom);
    };

    update();
    el.addEventListener("scroll", update);
    return () => el.removeEventListener("scroll", update);
  }, [sections]);

  const completedSections = participantInfo.data?.data.completedSectionIds;

  return (
    <div className="flex flex-col lg:flex-row h-full text-white">
      {/* Desktop sidebar */}
      <div className="lg:w-1/5 w-1/4 hidden lg:flex flex-col border-b md:border-b-0 md:border-r p-6 md:p-8">
        <h1 className="font-semibold text-lg">Course content</h1>
        <p className="pb-4 text-sm text-stone-300">{totalTime} minutes total</p>
        <div className="flex flex-col gap-2 md:gap-4">
          <Link to={`/course/${course?.courseId}`}>
            <Button variant={'outline'} size={'sm'} className="w-full cursor-pointer">
              <Home />
              <p className="w-fit line-clamp-1">
                {course?.courseName}
              </p>
            </Button>
          </Link>
          <div className="relative">
            {/* Top gradient overlay */}
            {showTop && (
              <div className="absolute top-0 left-0 right-0 h-16 bg-linear-to-b from-background to-transparent pointer-events-none z-10" />
            )}

            <div
              ref={scrollRef}
              className="flex flex-col gap-2 max-h-[600px] overflow-y-scroll scrollbar-hide"
            >
              {sections.map((val, index) => {
                const completedSections = participantInfo.data?.data.completedSectionIds || [];
                const isCompleted = completedSections.includes(val.sectionId!);

                return (
                  <Link key={index} to={`/course/${course?.courseId}/section/${val.sectionId}`}>
                    <CourseContent
                      {...val}
                      canDelete={false}
                      onDelete={() => { }}
                      onEdit={() => { }}
                      isCompleted={isCompleted}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Bottom gradient overlay */}
            {showBottom && (
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-background to-transparent pointer-events-none z-10" />
            )}
          </div>
        </div>
      </div>

      {/* Mobile / tablet horizontal sections */}
      <div className="lg:hidden w-full overflow-x-auto p-2">
        <div className="flex gap-2 h-full">
          <Link to={`/course/${course?.courseId}`}>
            <Button variant={'outline'} size={'sm'}>
              <Home />
              Course page
            </Button>
          </Link>
          {sections.map((val, index) => {
            const completedSections = participantInfo.data?.data.completedSectionIds || [];
            const isCompleted = completedSections.includes(val.sectionId!);

            return (
              <Link key={index} to={`/course/${course?.courseId}/section/${val.sectionId}`} className="shrink-0">
                <CourseContent
                  {...val}
                  canDelete={false}
                  onDelete={() => { }}
                  onEdit={() => { }}
                  isCompleted={isCompleted}
                />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main content / Outlet */}
      <div className="flex-1 h-full">
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
            {sections.map((val, index) => {
              const completedSections = participantInfo.data?.data.completedSectionIds || [];
              const isCompleted = completedSections.includes(val.sectionId!);

              return (
                <Link key={index} to={`/course/${course?.courseId}/section/${val.sectionId}`}>
                  <CourseContent
                    {...val}
                    canDelete={false}
                    onDelete={() => { }}
                    onEdit={() => { }}
                    isCompleted={isCompleted}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      }
    </div>
  );
};