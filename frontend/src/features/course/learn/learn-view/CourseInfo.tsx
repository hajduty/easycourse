import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Link, useOutletContext, useParams } from "react-router";
import { useAuth } from "@/providers/AuthProvider";
import { useRegisterParticipant } from "../../hooks/participant/useCreateParticipant";
import { useRemoveParticipant } from "../../hooks/participant/useDeleteParticipant";
import { useParticipantInfo } from "../../hooks/participant/useGetParticipant";
import { Separator } from "@/components/ui/separator";

interface CourseInfoContext {
  course: any;
  date: Date | null;
  otherCourses: any[];
  user: any;
  sections: any[];
  totalTime: number;
}

export const CourseInfo = () => {
  const {
    course,
    date,
    otherCourses,
    user,
  } = useOutletContext<CourseInfoContext>();

  const { sectionId, courseId } = useParams<{ sectionId: string; courseId: string }>();

  const { user: userInfo } = useAuth();

  const participantInfo = useParticipantInfo(courseId!, userInfo?.id!);
  const registerParticipant = useRegisterParticipant();
  const unregisterParticipant = useRemoveParticipant();

  const handleParticipateToggle = () => {
    if (!courseId || !userInfo?.id) return;

    if (isParticipant) {
      // Unregister
      unregisterParticipant.mutate({
        courseId: courseId!,
        userId: userInfo.id,
      });
    } else {
      // Register
      registerParticipant.mutate({
        courseId: courseId!,
        userId: userInfo.id,
        participantInfo: {
          userId: userInfo.id,
          courseId: courseId,
        },
      });
    }
  };
  const isParticipant = !!participantInfo.data?.data;
  const isLoading = registerParticipant.isPending;

  return (
    <div className="flex md:flex-row flex-col h-full">
      <div className="md:w-5/7 xl:w-4/5 w-full border-b md:border-b-0 p-6 xl:p-8 flex flex-col gap-6">
        <div className="relative w-full rounded-xl overflow-visible pb-12">
          <div className="h-60 overflow-hidden rounded-xl">
            <img
              draggable={false}
              src="https://picsum.photos/600/400"
              alt="Course cover"
              className="w-full h-full object-cover select-none"
            />
          </div>

          <div className="absolute bottom-6 right-6">
            <Button
              className={`${isParticipant ? "bg-red-500 hover:bg-red-700 w-32" : "bg-green-700 hover:bg-green-800 w-42"
                } text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all duration-200 hover:-translate-y-0.5`}
              onClick={handleParticipateToggle}
              disabled={isLoading}
            >
              {isLoading
                ? isParticipant
                  ? "Leaving..."
                  : "Joining..."
                : isParticipant
                  ? "Leave course"
                  : "Join this course"}
            </Button>
          </div>

        </div>

        <h1 className="text-3xl font-bold -mt-12">{course?.courseName}</h1>
        <p className="text-stone-300 leading-relaxed">{course?.courseDescription}</p>

        <span className="flex gap-2">
          <p className="text-sm text-stone-500">
            Published: {date?.toLocaleDateString()}
          </p>
          <Separator orientation="vertical"></Separator>
          <p className="text-sm text-stone-500">
            {course?.views} Views
          </p>
        </span>

        {course?.createdById === user?.id && (
          <Link to={`/course/editor/${course?.courseId}`} className="self-start">
            <Button variant="secondary" className="flex items-center gap-2">
              <Pencil /> Go to editor
            </Button>
          </Link>
        )}
      </div>

      <div className="md:w-2/7 xl:w-1/5 w-full px-2 py-6 xl:pr-8 flex flex-col gap-6 bg-stone-950">
        <div>
          <p className="font-semibold mb-2">Created by</p>

          <div className="flex items-center gap-4 bg-stone-950 rounded">
            <img
              draggable={false}
              src={"https://picsum.photos/150"}
              alt="Creator"
              className="w-20 h-20 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-l"
            />
            <div>
              <h2 className="font-semibold md:text-xs text-lg text-wrap line-clamp-1">John Doe </h2>
              <p className="md:text-xs text-sm text-stone-400">4 courses</p>
              <p className="md:text-xs text-sm text-stone-500">Joined 2025-11-15</p>
            </div>
          </div>

          {otherCourses?.length > 0 && (
            <h2 className="pt-6 font-semibold">More by this user</h2>
          )}

          <div className="flex flex-col gap-4 md:mt-2 w-full">
            {otherCourses?.slice(0, 6).map((val) => (
              <Link key={val.courseId} to={`/course/${val.courseId}`}>
                <div className="flex items-center gap-3 rounded bg-stone-900/60 hover:bg-stone-800 transition">
                  <img
                    draggable={false}
                    src={"https://picsum.photos/150"}
                    alt={val.courseName}
                    className="w-20 h-20 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-l"
                  />
                  <div className="flex flex-col overflow-hidden p-1">
                    <h2 className="font-semibold text-xs line-clamp-1 text-wrap">{val.courseName}</h2>
                    <p className="text-xs text-stone-400 line-clamp-1 text-wrap">
                      {val.courseDescription}
                    </p>
                    <p className="text-xs text-stone-500 line-clamp-1">
                      {val.participantCount} participants
                    </p>
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
