import type { FC } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import type { CourseResponse } from "@/types/course";
import { useNavigate } from "react-router";

export const CourseCard: FC<CourseResponse> = ({ courseName, courseDescription, createdBy, courseId }) => {
  const navigate = useNavigate();

  return (
    <Card className="min-w-64 min-h-64 rounded-lg overflow-hidden shadow-md relative group cursor-pointer p-0 m-0"
    onClick={() => navigate(`/course/${courseId}`)}>
      <img
        draggable={false}
        src={"https://picsum.photos/150"}
        alt={courseName}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 w-full bg-stone-900/80 border backdrop-blur-lg pt-2 transition-all duration-300 max-h-[18%] group-hover:max-h-full overflow-hidden px-4 pb-4">
        <CardTitle className="text-stone-300 text-md">{courseName}</CardTitle>
        <CardContent className="p-0 mt-1 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <CardDescription className="text-pretty">{courseDescription}</CardDescription>
        </CardContent>
        <CardFooter className="p-0 mt-2 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p>Created by {createdBy}</p>
        </CardFooter>
      </div>
    </Card>
  );
};
