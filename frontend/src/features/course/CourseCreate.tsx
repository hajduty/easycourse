import { Input } from "@/components/ui/input"
import { Navbar } from "../home/components/Navbar"
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export const CourseCreate = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  return (
    <>
      <Navbar></Navbar>
      <div className="relative flex flex-col gap-8 justify-center items-center pt-16 dark">
        <div className="w-full max-w-6xl mx-auto px-4">
          <h1 className="text-white text-2xl font-medium pb-6">Create a new course</h1>
          <div className="flex flex-col w-full text-stone-200 gap-2 md:justify-center transition-all duration-300 ease-in-out">
            <span className="w-full space-y-1 pb-2">
              <p className="font-semibold text-sm text-stone-300">Title</p>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </span>
            <span className="w-full space-y-1 pb-2">
              <p className="font-semibold text-sm text-stone-300">Description</p>
              <Textarea maxLength={1000} value={description} onChange={(e) => setDescription(e.target.value)} className="max-h-[600px] h-screen" />
            </span>
            <div className="dark">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Show Dialog</Button>
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
                    <AlertDialogCancel >Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
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