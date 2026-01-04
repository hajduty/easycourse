import { useAuth } from "@/providers/AuthProvider";
import { useParams } from "react-router";
import { useUser } from "./hooks/useUser";
import { imageUrl } from "@/lib/apiClient";
import { CourseCard } from "../course/components/CourseCard";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useGetParticipationsByUser } from "../course/hooks/participant/useGetParticipationsByUser";
import { UploadImage } from "../api";
import { useRef, useState } from "react";
import { useUpdateUser } from "./hooks/useUpdateUser";
import { useWindowSize } from "@/hooks/use-window-size";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useCoursesByUser } from "../course/hooks/course/useCoursesByUser";

export const UserPage = () => {
  const { userId: routeUserId } = useParams();
  const { user: authUser } = useAuth();
  const { width } = useWindowSize();
  const inputRef = useRef<HTMLInputElement>(null);
  const [showAllCourses, setShowAllCourses] = useState(false);

  const resolvedUserId = routeUserId ?? authUser?.id;
  const user = useUser(resolvedUserId!);
  const updateUser = useUpdateUser();
  const courses = useCoursesByUser(resolvedUserId);
  const joinedCourses = useGetParticipationsByUser(resolvedUserId!);
  const maxVisibleCourses = width < 768 ? 6 : width < 1024 ? 8 : 12;

  const visibleCourses = courses.data?.data
    ? showAllCourses
      ? courses.data.data
      : courses.data.data.slice(0, maxVisibleCourses)
    : [];

  const date = user?.data?.createdAt ? new Date(user.data.createdAt) : null;

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      var newImage = await UploadImage(file);
      if (newImage && newImage.data) {
        updateUser.mutate({
          userId: resolvedUserId!,
          data: {
            imageId: newImage.data.id,
            id: resolvedUserId!,
            email: user.data!.email,
            username: user.data?.username,
          },
        });
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Profile */}
      <div className="relative pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <div className="relative group">
              <Avatar className="w-48 h-48 border-4 border-neutral-800 shadow-2xl transition-all duration-300 group-hover:border-neutral-700">
                <AvatarImage
                  src={imageUrl + user.data?.imagePath}
                  alt={user?.data?.username}
                  className="object-cover"
                />
                <AvatarFallback className="text-7xl bg-gradient-to-br from-purple-500 to-pink-500">
                  {user?.data?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Camera Icon Overlay */}
              <button
                onClick={handleClick}
                className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
              >
                <Camera className="w-8 h-8 text-white" />
              </button>

              <input
                type="file"
                ref={inputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {user?.data?.username}
              </h1>
              <p className="text-neutral-400 text-lg">
                Member since {date?.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>

              {/* Stats */}
              <div className="flex gap-8 mt-6 justify-center md:justify-start">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    {courses.data?.data?.length || 0}
                  </p>
                  <p className="text-sm text-neutral-400">Courses Created</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    {joinedCourses.data?.data?.length || 0}
                  </p>
                  <p className="text-sm text-neutral-400">Courses Joined</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Created Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Courses Created</h2>
        </div>

        {visibleCourses.length > 0 ? (
          <>
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {visibleCourses.map((course) => (
                <div
                  className="transition-transform hover:scale-105 duration-300"
                  key={course.courseId}
                >
                  <CourseCard {...course} size="small" />
                </div>
              ))}
            </div>

            {courses.data?.data && courses.data.data.length > maxVisibleCourses && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => setShowAllCourses(!showAllCourses)}
                  variant="outline"
                  className="bg-neutral-900 border-neutral-700 hover:bg-neutral-800 text-white"
                >
                  {showAllCourses ? "Show Less" : `View All ${courses.data.data.length} Courses`}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="h-80 flex flex-col items-center justify-center bg-neutral-900/30 rounded-2xl border-2 border-dashed border-neutral-800">
            <p className="text-neutral-500 text-lg mb-2">No courses created yet</p>
            <p className="text-neutral-600 text-sm">Start creating your first course!</p>
          </div>
        )}
      </div>

      {/* Courses Joined Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Courses Joined</h2>
        </div>

        {joinedCourses.data?.data.length! > 0 ? (
          <Carousel opts={{ dragFree: true, align: "start" }} className="w-full">
            <CarouselContent className="-ml-4">
              {joinedCourses.data?.data.map((val, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                >
                  <div className="transition-transform duration-300">
                    <CourseCard
                      size="small"
                      {...val.course!}
                      completedSections={val.completedSectionIds?.length}
                      totalSections={val.totalSections}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          <div className="h-80 flex flex-col items-center justify-center bg-neutral-900/30 rounded-2xl border-2 border-dashed border-neutral-800">
            <p className="text-neutral-500 text-lg mb-2">No courses joined yet</p>
            <p className="text-neutral-600 text-sm">Explore and join courses to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};