import { Button } from "@/components/ui/button";
import { Navbar } from "./components/Navbar"
import dashboard from '@/assets/dashboard-dark.png';
import { useNavigate } from "react-router";

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="overflow-clip">
      <Navbar />
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start gap-4 pt-64 text-white">
        <div className="max-w-xl space-y-4 text-start">
          <h1 className="text-4xl font-bold">
            Discover and Create Free Learning Content
          </h1>
          <p className="text-lg">
            Join thousands* of learners and educators* around the world*.
            Explore tutorials, courses, and guides, or create your own content to help others learn.
          </p>
          <Button className="text-lg font-semibold cursor-pointer" onClick={() => navigate("course")}>Browse courses</Button>
        </div>
      </div>
    </div>
  )
}