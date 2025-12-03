import { useAuth } from "@/providers/AuthProvider";
import { useParams } from "react-router";
import { useUser } from "./hooks/useUser";
import { imageUrl } from "@/lib/apiClient";
import { useCoursesByUser } from "../course/hooks/course/useCoursesByUser";
import { CourseCard } from "../course/components/CourseCard";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useGetParticipationsByUser } from "../course/hooks/participant/useGetParticipationsByUser";
import { UploadImage } from "../api";
import { useRef } from "react";
import { useUpdateUser } from "./hooks/useUpdateUser";
import { useWindowSize } from "@/hooks/use-window-size";

export const UserPage = () => {
  const { userId: routeUserId } = useParams();
  const { user: authUser } = useAuth();
  const { width } = useWindowSize();
  const inputRef = useRef<HTMLInputElement>(null);

  const resolvedUserId = routeUserId ?? authUser?.id;
  const user = useUser(resolvedUserId!);
  const updateUser = useUpdateUser();
  const courses = useCoursesByUser(resolvedUserId);
  const joinedCourses = useGetParticipationsByUser(resolvedUserId!);
  const maxVisibleCourses =
    width < 768 ? 6 : width < 1024 ? 8 : 12;

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
            username: user.data?.username
          },
        });
      }
    }
  };

  return (
    <div className="md:mx-auto w-full max-w-6xl pt-20 px-4">
      <div className="flex md:flex-row flex-col gap-8 text-white items-center">
        <span className="flex flex-col gap-2 pt-10">
          <div className="group">
            <img
              src={imageUrl + user.data?.imagePath}
              alt=""
              className="w-64 h-64 aspect-square border-2 max-h-64 max-w-64 object-fit rounded-full hover:opacity-80 cursor-pointer"
              draggable={false}
              onClick={handleClick}
            />
            <input
              type="file"
              ref={inputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <p className="text-white text-3xl">{user?.data?.username}</p>
          <p className="font-thin">Joined {date?.toLocaleDateString()}</p>
        </span>

        {/* Courses created grid */}
        <div className="text-white grow p-4">
          <h2 className="md:text-lg text-xl font-medium mb-4">Courses created</h2>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 auto-rows-auto">
            {courses.data?.data.slice(0, maxVisibleCourses).map((course) => (
              <div className="transition-transform" key={course.courseId}>
                <CourseCard {...course} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:px-0 p-4">
        <h2 className="md:text-lg text-xl font-medium mt-4 text-white">
          Courses joined
        </h2>
        <Carousel opts={{ dragFree: true }}>
          <CarouselContent>
            {joinedCourses.data?.data.map((val, index) => (
              <CarouselItem
                key={index}
                className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 select-none p-4"
              >
                <CourseCard key={index} {...val.course!} completedSections={val.completedSectionIds?.length} totalSections={val.totalSections} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};
