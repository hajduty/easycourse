import { useState, type FC } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import type { CourseResponse } from "@/types/course";
import { Link, useNavigate } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { imageUrl } from "@/lib/apiClient";
import { StarRating } from "@/features/rating/components/RatingStars";
import { useCourseRating } from "@/features/rating/hooks/useRatings";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useUser } from "@/features/user/hooks/useUser";
import { AvatarFallback } from "@/components/ui/avatar";

interface CourseCardResponse extends CourseResponse {
  totalSections?: number,
  completedSections?: number,
}

export const CourseCard: FC<CourseCardResponse> = ({ courseName, courseDescription, createdBy,createdById, courseId, completedSections, totalSections, imagePath, totalRatings, averageRating }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const navigate = useNavigate();

  const creatorInfo = useUser(createdById);

  return (
    <Card
      className="min-w-32 min-h-32 rounded-lg overflow-hidden shadow-md relative group cursor-pointer p-0 m-0 aspect-square"
      onClick={() => navigate(`/course/${courseId}`)}
    >
      {!isImageLoaded && <Skeleton className="w-full aspect-square h-full object-cover" />}

      <img
        draggable={false}
        src={imageUrl + imagePath}
        alt={courseName}
        onLoad={() => setIsImageLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
      />

      <span className="absolute top-2 right-2 flex items-center">
        <StarRating readOnly={true} value={averageRating} className="opacity-40 group-hover:opacity-100 transition duration-300" />
        <p className="text-xs text-neutral-400">({totalRatings})</p>
      </span>

      <div className={`absolute bottom-0 w-full bg-neutral-900/40 border backdrop-blur-lg pt-4 transition-all duration-300 ${completedSections != null ? "max-h-[28%]" : "max-h-[18%]"} group-hover:max-h-full overflow-hidden px-4 pb-4`}>
        {totalSections != null && completedSections != null && (
          <div className="absolute top-0 left-0 right-0 h-2 bg-neutral-500/20 overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{
                width: `${totalSections > 0 ? (completedSections / totalSections) * 100 : 0}%`,
              }}
            />
          </div>
        )}

        <div className="relative">
          <CardTitle className="text-neutral-300 text-wrap">{courseName}</CardTitle>

          <CardContent className="p-0 mt-1 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <CardDescription className="text-pretty">{courseDescription}</CardDescription>
          </CardContent>

          <CardFooter className="p-0 mt-2 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Avatar className="aspect-square">
              <AvatarImage src={imageUrl + creatorInfo.data?.imagePath} className="rounded-full aspect-square h-6"></AvatarImage>
              <AvatarFallback className="bg-black p-1 text-sm">{createdBy.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Link to={`/user/profile/${createdById}`} onClick={(e) => {e.preventDefault(); e.stopPropagation(); navigate(`/user/profile/${createdById}`);}}> 
            <p className="text-sm px-2 hover:underline">{createdBy}</p>
            </Link>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

/*     <Card
      className="min-w-32 min-h-32 rounded-lg overflow-hidden shadow-md relative group cursor-pointer p-0 m-0 aspect-square"
      onClick={() => navigate(`/course/${courseId}`)}
    >
      {!isImageLoaded && <Skeleton className="w-full aspect-square h-full object-cover " />}

      <img
        draggable={false}
        src={imageUrl + imagePath}
        alt={courseName}
        onLoad={() => setIsImageLoaded(true)}
        className={`w-full h-full min-h-32 min-w-32 object-cover transition-opacity duration-500 ${isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
      />

      <div className={`absolute bottom-0 w-full bg-neutral-900/80 border backdrop-blur-lg pt-4 transition-all duration-300 ${completedSections != null ? "max-h-[28%] " : "max-h-[18%] "} group-hover:max-h-full overflow-hidden px-4 pb-4`}>
        {totalSections != null && completedSections != null && (
          <div className="absolute top-0 left-0 right-0 h-2 bg-neutral-500/20 overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{
                width: `${totalSections > 0 ? (completedSections / totalSections) * 100 : 0}%`,
              }}
            />
          </div>
        )}

        <div className="relative">
          <CardTitle className="text-neutral-300 text-wrap">{courseName}</CardTitle>

          <CardContent className="p-0 mt-1 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <CardDescription className="text-pretty">{courseDescription}</CardDescription>
          </CardContent>

          <CardFooter className="p-0 mt-2 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-sm">Created by {createdBy}</p>
          </CardFooter>
        </div>
      </div>
    </Card> */
