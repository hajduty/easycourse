import { Button } from "@/components/ui/button";
import { Navbar } from "./components/Navbar"
import { useNavigate } from "react-router";

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="overflow-clip">
      <Navbar />
      <div className="max-w-6xl mx-auto flex flex-row lg:flex-col items-center gap-8 text-white h-screen align-middle justify-center -mt-20">
          <h1 className="text-4xl font-bold">
            Discover and Create Free Learning Content
          </h1>
          <p className="text-lg">
            Explore tutorials, courses, and guides, or share your own knowledge with others.
          </p>
          <Button className="text-md font-semibold cursor-pointer" onClick={() => navigate("course")}>Browse courses</Button>
      </div>
    </div>
  )
}