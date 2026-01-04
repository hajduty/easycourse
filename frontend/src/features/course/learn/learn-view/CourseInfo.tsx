import { Button } from "@/components/ui/button";
import { CalendarClock, Eye, Pencil, Star, Users } from "lucide-react";
import { Link, useOutletContext, useParams } from "react-router";
import { useAuth } from "@/providers/AuthProvider";
import { useRegisterParticipant } from "../../hooks/participant/useCreateParticipant";
import { useRemoveParticipant } from "../../hooks/participant/useDeleteParticipant";
import { useParticipantInfo } from "../../hooks/participant/useGetParticipant";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/animate-ui/components/animate/tooltip";

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

  const { data: creatorInfo, isLoading: isCreatorLoading } = useUser(course?.createdById);

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

    // Update average rating locally for immediate visual feedback
    if (existingRating) {
      // Update existing rating: replace old rating with new rating
      course.averageRating = ((course.averageRating * course.totalRatings) - existingRating.score! + val) / course.totalRatings;
      updateRatings.mutate({
        ...existingRating,
        score: val,
      });
    }
    else {
      // Add new rating: increment total ratings and recalculate average
      course.totalRatings += 1;
      course.averageRating = ((course.averageRating * (course.totalRatings - 1)) + val) / course.totalRatings;
      addRatings.mutate({
        userId: userInfo.id,
        entityId: courseId,
        entityType: "Course",
        score: val,
      });
    }
  }

  // Show skeleton while data is loading
  const isDataLoading = participantInfo.isLoading || currentRatings.isLoading || comments.isLoading || isCreatorLoading;

  if (isDataLoading) {
    return (
      <TooltipProvider>
        <div className="flex md:flex-row flex-col h-full">
          {/* MAIN CONTENT */}
          <div className="md:w-5/7 xl:w-4/5 w-full border-b md:border-b-0 p-2 xl:p-8 flex flex-col gap-6">

            {/* Image container */}
            <div className="relative w-full xl:rounded-xl rounded-sm overflow-hidden h-96 border">
              <Skeleton className="absolute inset-0" />

              {/* Bottom gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-t from-black/40 to-transparent" />

              {/* Title + stats */}
              <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                <Skeleton className="h-8 w-2/3" />

                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-1" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-1" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>

              {/* Join button */}
              <div className="absolute bottom-4 right-4">
                <Skeleton className="h-10 w-36 rounded-lg" />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Publish date */}
            <Skeleton className="h-4 w-48" />

            {/* Comments */}
            <div className="space-y-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-20 w-full rounded-lg" />

              <div className="space-y-3">
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-5/6 rounded-lg" />
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="md:w-2/7 xl:w-1/5 w-full px-2 py-6 xl:pr-8 flex flex-col gap-6">

            {/* Creator */}
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <div className="flex items-center gap-4 border bg-neutral-900 rounded">
                <Skeleton className="w-20 h-20 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-l" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </div>

            {/* More courses */}
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <div className="flex flex-col gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 rounded border">
                    <Skeleton className="w-20 h-20 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-l" />
                    <div className="flex-1 space-y-2 p-1">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider openDelay={200}>
      <div className="flex md:flex-row flex-col h-full">
        <div className="md:w-5/7 xl:w-4/5 w-full border-b md:border-b-0 p-2 xl:p-8 flex flex-col gap-6">
          <div className="relative w-full xl:rounded-xl rounded-sm overflow-hidden h-96 border">
            <img
              draggable={false}
              src={imageUrl + course?.imagePath}
              alt="Course cover"
              className="w-full h-full object-cover select-none"
            />

            <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex flex-col gap-2 text-white">
                <h1 className="text-3xl font-bold drop-shadow-lg shadow-black">{course?.courseName}</h1>
                <div className="flex items-center gap-2 md:gap-4 select-none">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="flex items-center gap-1 text-sm">
                        <Eye size={16} color="#C77DFF" />
                        {course?.views}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="bg-neutral-900 text-white" arrowClassName="fill-neutral-900">
                      Total views: {course?.views}
                    </TooltipContent>
                  </Tooltip>
                  <Separator orientation="vertical" className="h-4 bg-white" />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="flex items-center gap-1 text-sm">
                        <Users size={16} color="#5FA8F5" />
                        {course?.participantCount}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="bg-neutral-900 text-white" arrowClassName="fill-neutral-900">
                      Number of participants: {course?.participantCount}
                    </TooltipContent>
                  </Tooltip>
                  <Separator orientation="vertical" className="h-4 bg-white" />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="flex items-center gap-1 text-sm">
                        <Star size={16} color="" fill="#FFCC4D" />
                        {course?.averageRating.toFixed(1)} ({course?.totalRatings})
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="bg-neutral-900 text-white" arrowClassName="fill-neutral-900">
                      Average rating: {course?.averageRating.toFixed(1)} from {course?.totalRatings} ratings
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 right-4">
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
{/*           <p className="text-neutral-300 leading-relaxed min-h-32">{course?.courseDescription}</p>

          <p className="text-sm text-neutral-500">
            Published: {date?.toLocaleDateString()}
          </p> */}
          <div className="border bg-neutral-900/40 rounded-lg p-4 flex flex-col gap-4">
            <span className="flex flex-row gap-2">
              <h2 className="text-neutral-300 text-sm">Your rating: </h2>
              <StarRating onChange={handleRating} value={currentRatings.data?.data?.score}></StarRating>
            </span>
            <Separator className="bg-neutral-800"></Separator>
            <h1 className="font-semibold select-none">About this course</h1>
            <p className="text-sm -mt-2">{course?.courseDescription}</p>
            <span className="text-xs text-neutral-500 flex font-semibold flex-row items-center gap-2 mt-1">
              <span className="flex gap-1">
                <CalendarClock size={14} />
                Published {date?.toLocaleDateString()}
              </span>
            </span>
          {course?.createdById === user?.id && (
            <Link to={`/course/editor/${course?.courseId}`} className="self-start">
              <Button variant="secondary" className="flex items-center gap-2">
                <Pencil /> Edit course
              </Button>
            </Link>
          )}
          </div>
          <div className="bg-neutral-900/40 border rounded-lg p-4">
            <div className="w-full">
              <h1 className="text-white font-semibold">
                Comments <span className="text-neutral-400 text-xs">({comments.data?.data.length || 0})</span>
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
                  <AvatarImage src={imageUrl + creatorInfo?.imagePath} alt={creatorInfo?.username} className="rounded-none object-cover" />
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
                      className="w-20 h-20 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-l object-cover"
                    />
                    <div className="flex flex-col overflow-hidden p-1 justify-between">
                      <h2 className="font-semibold text-xs line-clamp-1 text-wrap">{val.courseName}</h2>
                      <p className="text-xs text-neutral-400 line-clamp-1 text-wrap">
                        {val.courseDescription}
                      </p>
                      <span className="text-xs text-neutral-500 flex font-semibold flex-row items-center gap-2 mt-1">
                        <span className="flex gap-1">
                          <Users size={14} />
                          {val.participantCount}
                        </span>
                        <span className="flex gap-1">
                          <Star size={13} />
                          {val.averageRating.toFixed(1)}
                        </span>
                        <span className="flex gap-1">
                          <Eye size={14} />
                          {val.views}
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
