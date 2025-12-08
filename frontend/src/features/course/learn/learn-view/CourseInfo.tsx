import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Link, useOutletContext, useParams } from "react-router";
import { useAuth } from "@/providers/AuthProvider";
import { useRegisterParticipant } from "../../hooks/participant/useCreateParticipant";
import { useRemoveParticipant } from "../../hooks/participant/useDeleteParticipant";
import { useParticipantInfo } from "../../hooks/participant/useGetParticipant";
import { Separator } from "@/components/ui/separator";
import type { CourseResponse } from "@/types/course";
import { imageUrl } from "@/lib/apiClient";
import { useUser } from "@/features/user/hooks/useUser";
import { StarRating } from "@/features/rating/components/RatingStars";
import { useAddRating, useCourseRating, useUpdateRating } from "@/features/rating/hooks/useRatings";
import { useState } from "react";
import { UpdateRating } from "@/features/rating/api";
import { NewComment } from "@/features/comment/components/NewComment";
import { CommentList } from "@/features/comment/components/CommentList";
import { useCommentsForEntity } from "@/features/comment/hooks/useComment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface CourseInfoContext {
  course: CourseResponse;
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
  const { courseId } = useParams<{ sectionId: string; courseId: string }>();
  const { user: userInfo, authenticated } = useAuth();

  const participantInfo = useParticipantInfo(courseId!, userInfo?.id!);
  const registerParticipant = useRegisterParticipant();
  const unregisterParticipant = useRemoveParticipant();
  const currentRatings = useCourseRating(courseId!, userInfo?.id!);
  const updateRatings = useUpdateRating();
  const addRatings = useAddRating();
  const comments = useCommentsForEntity("course", courseId!);

  const [ratings, setRatings] = useState<number | undefined>(currentRatings.data?.data.score);

  const creatorInfo = useUser(course?.createdById).data;

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

  const creatorDate = creatorInfo?.createdAt ? new Date(creatorInfo.createdAt) : null;

  const handleRating = (val: number) => {
    if (!courseId || !userInfo?.id) return;
    const existingRating = currentRatings.data?.data;

    if (existingRating) {
      updateRatings.mutate({
        ...existingRating,
        score: val,
      });
    }
    else {
      addRatings.mutate({
        userId: userInfo.id,
        entityId: courseId,
        entityType: "Course",
        score: val,
      });
    }
  }

  return (
    <div className="flex md:flex-row flex-col h-full">
      <div className="md:w-5/7 xl:w-4/5 w-full border-b md:border-b-0 p-6 xl:p-8 flex flex-col gap-6">
        <div className="relative w-full rounded-xl overflow-visible pb-12">
          <div className="h-60 overflow-hidden rounded-xl border">
            <img
              draggable={false}
              src={imageUrl + course?.imagePath}
              alt="Course cover"
              className="w-full h-full object-cover select-none"
            />
          </div>

          <div className="absolute bottom-6 right-6">
            <Button
              className={`disabled:bg-gray-400 ${isParticipant ? "bg-red-500 hover:bg-red-700 w-32" : "bg-green-700 hover:bg-green-800 w-42"
                } text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all duration-200 hover:-translate-y-0.5 `}
              onClick={handleParticipateToggle}
              disabled={isLoading || !authenticated}
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

        <span className="flex flex-row items-center gap-4 -mt-8 md:-mt-12">
          <h1 className="text-3xl font-bold">{course?.courseName}</h1>
          <span className="text-white flex gap-2 text-xs items-center">
            <StarRating onChange={handleRating} value={currentRatings.data?.data?.score} initialValue={course?.averageRating} />
            <p className="text-gray-400">{course?.averageRating}/5 <span className="text-gray-500">({course?.totalRatings} ratings)</span></p>
          </span>
        </span>
        <p className="text-neutral-300 leading-relaxed min-h-32">{course?.courseDescription}</p>

        <span className="flex gap-2">
          <p className="text-sm text-neutral-500">
            Published: {date?.toLocaleDateString()}
          </p>
          <Separator orientation="vertical"></Separator>
          <p className="text-sm text-neutral-500">
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
        <div className="w-full">
          <h1 className="text-neutral-400">
            {comments?.data?.data?.length
              ? `${comments.data.data.length} comments`
              : "No comments yet."}
          </h1>
          <NewComment
            name={user?.username}
            profilePic={user?.imagePath}
            entityType="course"
            entityId={courseId!}
          />
          <CommentList entityId={courseId!} entityType="course" />
        </div>
      </div>

      <div className="md:w-2/7 xl:w-1/5 w-full px-2 py-6 xl:pr-8 flex flex-col gap-6">
        <div>
          <p className="font-semibold mb-2">Created by</p>
          <Link to={`/user/profile/${course?.createdById}`}>
            <div className="flex items-center gap-4 border  bg-neutral-900 rounded hover:bg-neutral-800 transition">
              {/*               <img
                draggable={false}
                src={imageUrl + creatorInfo?.imagePath}
                alt="Creator"
                className="w-20 h-20 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-l"
              /> */}
                <Avatar className="w-20 h-20 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-none rounded-l">
                  <AvatarImage src={imageUrl + creatorInfo?.imagePath} alt={creatorInfo?.username} className="rounded-none"/>
                  <AvatarFallback className="rounded-none bg-black text-white">{creatorInfo?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              <div>
                <h2 className="font-semibold md:text-xs text-lg text-wrap line-clamp-1">{course?.createdBy} </h2>
                <p className="md:text-xs text-sm text-neutral-500">Joined {creatorDate?.toLocaleDateString()}</p>
              </div>
            </div>
          </Link>

          {otherCourses?.length > 0 && (
            <h2 className="pt-6 font-semibold">More by this user</h2>
          )}

          <div className="flex flex-col gap-4 md:mt-2 w-full">
            {otherCourses?.slice(0, 6).map((val) => (
              <Link key={val.courseId} to={`/course/${val.courseId}`}>
                <div className="flex items-center gap-3 rounded border hover:bg-neutral-800 transition">
                  <img
                    draggable={false}
                    src={imageUrl + val.imagePath}
                    alt={val.courseName}
                    className="w-20 h-20 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-l"
                  />
                  <div className="flex flex-col overflow-hidden p-1">
                    <h2 className="font-semibold text-xs line-clamp-1 text-wrap">{val.courseName}</h2>
                    <p className="text-xs text-neutral-400 line-clamp-1 text-wrap">
                      {val.courseDescription}
                    </p>
                    <p className="text-xs text-neutral-500 line-clamp-1">
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
