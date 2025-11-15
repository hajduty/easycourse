import { Input } from "@/components/ui/input"
import { Navbar } from "../home/components/Navbar"
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import type { CourseRequest } from "@/types/course";
import { CreateCourse } from "./api";
import { useNavigate } from "react-router";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlert } from "lucide-react";

export const CourseCreate = () => {
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseRequest>({
    courseDescription: "",
    courseName: "",
    sections: []
  });

  const [error, setError] = useState<string>("");

  const [creating, setCreating] = useState<boolean>(false);

  const handleCourseCreation = async () => {
    setCreating(true);
    try {
      const response = await CreateCourse(course);

      if (!response.success || !response.data) {
        setError("Error creating course, try again later.");
        return;
      }

      navigate(`/course/editor/${response.data.courseId}`);
    } catch (err) {
      console.log("API call failed", err);
      setError("Error creating course, try again later.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="relative flex flex-col gap-8 justify-center items-center pt-16 dark">
        <div className="w-full max-w-6xl mx-auto px-4">
          <h1 className="text-white text-2xl font-medium pb-6">Create a new course</h1>
          <div className="flex flex-col w-full text-stone-200 gap-2 md:justify-center transition-all duration-300 ease-in-out">
            <span className="w-full space-y-1 pb-2">
              <p className="font-semibold text-sm text-stone-300">Title</p>
              <Input value={course.courseName} onChange={(e) => setCourse((c) => ({ ...c, courseName: e.target.value }))} />
            </span>
            <span className="w-full space-y-1 pb-2">
              <p className="font-semibold text-sm text-stone-300">Description</p>
              <Textarea placeholder="Max 1000 characters..." maxLength={1000} value={course.courseDescription} onChange={(e) => setCourse((c) => ({ ...c, courseDescription: e.target.value }))} className="min-h-[200px] max-h-[500px] h-screen" />
            </span>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <CircleAlert></CircleAlert>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="self-end">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="default" className="cursor-pointer">
                    {creating && <Spinner />}
                    Create course</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="dark">
                  <AlertDialogHeader className="dark">
                    <AlertDialogTitle>Create course</AlertDialogTitle>
                    <AlertDialogDescription className="dark">
                      Are you sure you want to create this course?
                      Creating this course will instantly make it public.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCourseCreation}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}