import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CircleAlert, Plus, Upload } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useCreateCourse } from "../hooks/course/useCreateCourse";
import { useNavigate } from "react-router";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useCoursesByUser } from "../hooks/course/useCoursesByUser";
import { useAuth } from "@/providers/AuthProvider";
import { CourseCard } from "../components/CourseCard";
import { LargeCourseCard } from "../components/LargeCourseCard";
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
import { UploadImage } from "@/features/api";
import { imageUrl } from "@/lib/apiClient";

export default function CourseCreateBrowser() {
  usePageTitle("Create Course");
  const { user } = useAuth();
  const navigate = useNavigate();
  const createCourse = useCreateCourse();
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const [course, setCourse] = useState<{
    courseName: string;
    courseDescription: string;
    sections: never[];
    isPublic: boolean;
    imageId: string | undefined;
  }>({
    courseName: "",
    courseDescription: "",
    sections: [],
    isPublic: false,
    imageId: undefined,
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImagePath, setUploadedImagePath] = useState("");

  const userCourses = useCoursesByUser(user?.id);
  const myCourses = userCourses.data?.data ?? [];

  const handleCourseCreation = () => {
    setError("");

    // Create a clean course object without empty imageId
    const courseData = { ...course };
    if (!courseData.imageId) {
      delete courseData.imageId;
    }

    createCourse.mutate(courseData, {
      onSuccess: (response) => {
        if (!response.success || !response.data) {
          setError("Error creating course, try again later.");
          return;
        }

        setOpen(false);
        navigate(`/course/editor/${response.data.courseId}`);
      },
      onError: () => {setError("Error creating course, try again later.")}
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

        <Carousel className="w-full text-white" opts={{ dragFree: true }}>
          <CarouselContent className="-ml-2 md:ml-0 flex gap-4 sm:gap-6">
            <CarouselItem className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 select-none">
              <div
                onClick={() => setOpen(true)}
                role="button"
                tabIndex={0}
                className="aspect-square rounded-xl border border-neutral-700 bg-neutral-900/40 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-800 transition-all duration-300 group p-1"
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
                <CourseCard {...course} size="small"/>
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
          <DialogContent className="text-white max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create a new course</DialogTitle>
              <DialogDescription>
                Fill in the details to create a course.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col md:flex-row gap-4 py-2 h-full">
              <div className="flex flex-col gap-4 w-full md:w-1/2">
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

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="visibility"
                    checked={course.isPublic}
                    onCheckedChange={(checked) =>
                      setCourse((c) => ({ ...c, isPublic: checked as boolean }))
                    }
                  />
                  <Label htmlFor="visibility" className="text-sm text-neutral-300">
                    Make course public
                  </Label>
                </div>

                <div>
                  <p className="font-semibold text-sm text-neutral-300 pb-1">
                    Course Image
                  </p>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        setUploadingImage(true);
                        try {
                          const response = await UploadImage(file);
                          if (response.success && response.data) {
                            setCourse((c) => ({ ...c, imageId: response.data.id }));
                            setUploadedImagePath(response.data.path);
                          } else {
                            setError("Failed to upload image");
                          }
                        } catch (err) {
                          setError(err instanceof Error ? err.message : "Failed to upload image");
                        } finally {
                          setUploadingImage(false);
                        }
                      }}
                      disabled={uploadingImage}
                      className="flex-1"
                    />
                    {uploadingImage && <Spinner />}
                  </div>
                  {uploadedImagePath && (
                    <p className="text-xs text-neutral-400 mt-1">Image uploaded successfully</p>
                  )}
                </div>

                {error && (
                  <Alert variant="destructive">
                    <CircleAlert />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="w-full md:w-1/2 pointer-events-none select-none flex flex-col">
                <p className="font-semibold text-sm text-neutral-300 pb-2">Preview</p>
                <div className="flex-1 min-h-0">
                  <LargeCourseCard
                    courseId=""
                    courseName={course.courseName || "Course Title"}
                    courseDescription={course.courseDescription || "Course description will appear here..."}
                    createdBy={user?.username || "Creator"}
                    createdById={user?.id || ""}
                    sections={[]}
                    participantCount={0}
                    createdAt={new Date()}
                    isPublic={course.isPublic}
                    views={0}
                    imagePath={(uploadedImagePath || "uploads/images/placeholder.jpg")}
                    totalRatings={0}
                    averageRating={0}
                    totalReadTime={0}
                    className="pointer-events-none h-full"
                  />
                </div>
              </div>
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
