import { useNavigate, useOutletContext } from "react-router";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { useUpdateCourse } from "../../hooks/course/useUpdateCourse";
import { Eye, EyeOff, Pencil, Trash, CalendarClock, Users, Star } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useDeleteCourse } from "../../hooks/course/useDeleteCourse";
import { imageUrl } from "@/lib/apiClient";
import { UploadImage } from "@/features/api";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/animate-ui/components/animate/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Link } from "react-router";
import { useUser } from "@/features/user/hooks/useUser";

export const CourseEditor = () => {
  const { course, date, otherCourses, user } = useOutletContext<any>();
  const navigate = useNavigate();

  const [title, setTitle] = useState(course?.courseName || '');
  const [description, setDescription] = useState(course?.courseDescription || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isPublic, setIsPublic] = useState(course?.isPublic ?? false);

  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();
  const { data: creatorInfo, isLoading: isCreatorLoading } = useUser(course?.createdById);

  const save = () => {
    if (!course?.courseId) return;
    updateCourse.mutate({
      courseId: course.courseId,
      data: {
        courseName: title,
        courseDescription: description,
        isPublic: isPublic,
      },
    });
    setIsEditing(false);
  };

  const handleDeleteCourse = async () => {
    if (!course?.courseId) return;
    await deleteCourse.mutateAsync(course.courseId);
    navigate("/course/create");
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && course?.courseId) {
      var newImage = await UploadImage(file);
      if (course) course.imagePath = newImage.data.path;
      if (newImage && newImage.data) {
        updateCourse.mutate({
          courseId: course.courseId,
          data: {
            courseName: title,
            courseDescription: description,
            isPublic: isPublic,
            imageId: newImage.data.id,
            sections: course.sections,
          },
        });
      }
    }
  };

  const creatorDate = creatorInfo?.createdAt ? new Date(creatorInfo.createdAt) : null;

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
                <div className="flex items-center gap-2 md:gap-4">
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
                        {course?.averageRating?.toFixed(1) || '0.0'} ({course?.totalRatings || 0})
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="bg-neutral-900 text-white" arrowClassName="fill-neutral-900">
                      Average rating: {course?.averageRating?.toFixed(1) || '0.0'} from {course?.totalRatings || 0} ratings
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>

          <div className="border bg-neutral-900/40 rounded-lg p-4 flex flex-col gap-4">
            <h1 className="font-semibold select-none">About this course</h1>
            <p className="text-sm -mt-2">{course?.courseDescription}</p>
            <span className="text-xs text-neutral-500 flex font-semibold flex-row items-center gap-2 mt-1">
              <span className="flex gap-1">
                <CalendarClock size={14} />
                Created {date?.toLocaleDateString()}
              </span>
            </span>
            <div className="flex gap-2 justify-end">
              <AlertDialog>
                <AlertDialogTrigger className="bg-red-400/60 hover:bg-red-400/50 transition px-2 rounded-md text-sm flex align-middle items-center gap-1 cursor-pointer">
                  <Trash size={17} />
                  Delete
                </AlertDialogTrigger>
                <AlertDialogContent className="text-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete course?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this course
                      and all sections related to it.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => { handleDeleteCourse() }}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button onClick={() => setIsEditing(true)} className="w-fit cursor-pointer">
                <Pencil /> Edit Details
              </Button>
            </div>
          </div>
        </div>

        <div className="md:w-2/7 xl:w-1/5 w-full px-2 py-6 xl:pr-8 flex flex-col gap-6">
          <div>
            <p className="font-semibold mb-2">Created by</p>
            <Link to={`/user/profile/${course?.createdById}`}>
              <div className="flex items-center gap-4 border  bg-neutral-900 rounded hover:bg-neutral-800 transition">
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
              {otherCourses?.slice(0, 6).map((val: any) => (
                <Link key={val?.courseId} to={`/course/editor/${val?.courseId}`}>
                  <div className="flex items-center gap-3 rounded border hover:bg-neutral-800 transition">
                    <img
                      draggable={false}
                      src={imageUrl + val?.imagePath}
                      alt={val?.courseName}
                      className="w-20 h-20 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-l object-cover"
                    />
                    <div className="flex flex-col overflow-hidden p-1 justify-between">
                      <h2 className="font-semibold text-xs line-clamp-1 text-wrap">{val?.courseName}</h2>
                      <p className="text-xs text-neutral-400 line-clamp-1 text-wrap">
                        {val?.courseDescription}
                      </p>
                      <span className="text-xs text-neutral-500 flex font-semibold flex-row items-center gap-2 mt-1">
                        <span className="flex gap-1">
                          <Users size={14} />
                          {val?.participantCount || 0}
                        </span>
                        <span className="flex gap-1">
                          <Star size={13} />
                          {val?.averageRating?.toFixed(1) || '0.0'}
                        </span>
                        <span className="flex gap-1">
                          <Eye size={14} />
                          {val?.views || 0}
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
