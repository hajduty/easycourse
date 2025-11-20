import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import demobg from "@/assets/demobg.png"

export const HomePage = () => {

  return (
    <div className="relative h-screen flex flex-col items-center justify-center text-white -mt-20 p-4">
      <img
        src={demobg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover saturate-0 blur-3xl z-0"
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl flex flex-col items-center gap-8 text-center">
        <h1 className="text-2xl md:text-4xl font-bold">
          Discover and Create Free Learning Content
        </h1>
        <p className="md:text-lg text-md">
          Explore tutorials, courses, and guides, or share your own knowledge with others.
        </p>
        <Link to={"/course"}>
          <Button
            className="text-md font-semibold cursor-pointer"
          >
            Browse courses
          </Button>
        </Link>
      </div>
    </div>

  ) 
} 