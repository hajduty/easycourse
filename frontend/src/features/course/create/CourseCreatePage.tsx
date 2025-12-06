import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CircleAlert, Plus } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useCreateCourse } from "../hooks/course/useCreateCourse";
import { useNavigate } from "react-router";
import { useCoursesByUser } from "../hooks/course/useCoursesByUser";
import { useAuth } from "@/providers/AuthProvider";
import { CourseCard } from "../components/CourseCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { CourseStats } from "../components/CourseStats";

export default function CourseCreateBrowser() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const createCourse = useCreateCourse();
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const [course, setCourse] = useState({
    courseName: "",
    courseDescription: "",
    sections: [],
    isPublic: false,
  });

  const userCourses = useCoursesByUser(user?.id);
  const myCourses = userCourses.data?.data ?? [];

  const handleCourseCreation = () => {
    setError("");

    createCourse.mutate(course, {
      onSuccess: (response) => {
        if (!response.success || !response.data) {
          setError("Error creating course, try again later.");
          return;
        }

        setOpen(false);
        navigate(`/course/editor/${response.data.courseId}`);
      },
      onError: () => setError("Error creating course, try again later."),
    });
  };

  return (
    <div className="relative flex flex-col gap-8 pt-12 items-center dark w-full">
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="w-full text-white mt-12 dark">
          <h2 className="text-white text-xl sm:text-2xl font-medium text-start dark pb-8">
            Your courses
          </h2>
        </div>

        <Carousel className="w-full text-white">
          <CarouselContent className="-ml-2 md:ml-0 flex gap-4 sm:gap-6">
            <CarouselItem className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 select-none">
              <div
                onClick={() => setOpen(true)}
                role="button"
                tabIndex={0}
                className="rounded-xl border border-neutral-700 bg-neutral-900/40 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-800 transition min-w-32 min-h-48 h-full"
              >
                <Plus className="w-10 h-10 text-neutral-300 mb-2" />
                <p className="text-neutral-300 font-medium text-sm sm:text-base text-center">
                  Create course
                </p>
              </div>
            </CarouselItem>

            {myCourses.map((course, i) => (
              <CarouselItem
                key={i}
                className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 select-none"
              >
                <CourseCard {...course} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {myCourses.length > 0 && (
          <div className="w-full text-white mt-12 dark h-fit">
            <CourseStats courses={myCourses} />
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="text-white max-w-lg">
            <DialogHeader>
              <DialogTitle>Create a new course</DialogTitle>
              <DialogDescription>
                Fill in the details to create a course.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-2 ">
              <div>
                <p className="font-semibold text-sm text-neutral-300 pb-1">Title</p>
                <Input
                  value={course.courseName}
                  onChange={(e) =>
                    setCourse((c) => ({ ...c, courseName: e.target.value }))
                  }
                />
              </div>

              <div>
                <p className="font-semibold text-sm text-neutral-300 pb-1">
                  Description
                </p>
                <Textarea
                  placeholder="Max 1000 characters..."
                  maxLength={1000}
                  value={course.courseDescription}
                  onChange={(e) =>
                    setCourse((c) => ({ ...c, courseDescription: e.target.value }))
                  }
                  className="min-h-[150px]"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <CircleAlert />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => setOpen(false)}
                disabled={createCourse.isPending}
                className="cursor-pointer"
              >
                Cancel
              </Button>

              <Button onClick={handleCourseCreation} disabled={createCourse.isPending} className="cursor-pointer">
                {createCourse.isPending && <Spinner />}
                Create course
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
