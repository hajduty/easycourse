import { Input } from "@/components/ui/input";
import { Navbar } from "../home/components/Navbar";
import { CourseCard } from "./components/CourseCard";
import { Search } from "lucide-react";

export const CoursePage = () => {

  const courses = [
    {
      title: "React noobie tut",
      description: " Learn create learn create description titles",
      createdBy: "Hajder",
      image: "https://picsum.photos/150"
    },
    {
      title: "React noobie tut",
      description: " Learn create learndescription create description titles",
      createdBy: "Hajder",
      image: "https://picsum.photos/150"
    },
    {
      title: "React noobie tut",
      description: " Learn create learndescription create description titles",
      createdBy: "Hajder",
      image: "https://picsum.photos/150"
    },
    {
      title: "React noobie tut",
      description: " Learn create learndescription create description titles",
      createdBy: "Hajder",
      image: "https://picsum.photos/150"
    },
    {
      title: "React noobie tut",
      description: " Learn create learndescription create  description titles",
      createdBy: "Hajder",
      image: "https://picsum.photos/150"
    },
    {
      title: "React noobie tut",
      description: " Learn create learndescription create  description titles",
      createdBy: "Hajder",
      image: "https://picsum.photos/150"
    },
    {
      title: "React noobie tut",
      description: " Learn create learndescription create create create create create create create create description titles",
      createdBy: "Hajder",
      image: "https://picsum.photos/150"
    }
  ];

  return (
    <>
      <Navbar></Navbar>
      <div className="relative flex flex-col gap-8 justify-center items-center pt-16">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="flex flex-row w-full text-stone-200 gap-2 items-center">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
              <Input
                placeholder="Search for courses..."
                className="pl-10"
              />
            </div>
            <p>Hello!</p>
            <p>Hello!</p>
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-fit mx-auto">
            {courses.map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
};