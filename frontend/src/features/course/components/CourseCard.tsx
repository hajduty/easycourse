import type { FC } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";

interface CourseCardProps {
  title: string;
  description: string;
  createdBy: string;
  image: string;
}

export const CourseCard: FC<CourseCardProps> = ({ title, description, createdBy, image }) => {
  return (
    <Card className="w-64 h-64 rounded-lg overflow-hidden shadow-md relative group cursor-pointer p-0 m-0">
      <img
        draggable={false}
        src={image}
        alt={title}
        className="w-full h-full object-cover"
      />

      <div className="absolute bottom-0 w-full bg-stone-900 pt-2 transition-all duration-300 max-h-[20%] group-hover:max-h-full overflow-hidden px-4 pb-4">
        <CardTitle className="text-stone-300 text-lg">{title}</CardTitle>
        <CardContent className="p-0 mt-1 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <CardDescription className="text-pretty">{description}</CardDescription>
        </CardContent>
        <CardFooter className="p-0 mt-2 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p>Created by {createdBy}</p>
        </CardFooter>
      </div>
    </Card>
  );
};
