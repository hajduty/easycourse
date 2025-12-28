import { useState, type FC } from "react";
import { Card, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import type { CourseResponse } from "@/types/course";
import { Link, useNavigate } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { imageUrl } from "@/lib/apiClient";
import { useUser } from "@/features/user/hooks/useUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

const courseCardVariants = cva(
  "aspect-square rounded-xl overflow-hidden relative cursor-pointer p-0 transition-all duration-300 group p-1",
  {
    variants: {
      size: {
        default: "",
        small: "",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const overlayVariants = cva(
  "absolute bottom-0 left-0 right-0 bg-neutral-900/80 backdrop-blur-lg transition-all duration-300 overflow-hidden group-hover:h-full",
  {
    variants: {
      size: {
        default: "h-16",
        small: "h-12",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const titleVariants = cva(
  "text-neutral-200 font-semibold leading-tight",
  {
    variants: {
      size: {
        default: "text-sm",
        small: "text-xs",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const descriptionVariants = cva(
  "text-white leading-relaxed",
  {
    variants: {
      size: {
        default: "text-xs",
        small: "text-[10px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const ratingBadgeVariants = cva(
  "absolute right-2 top-2 p-1 px-2 rounded-lg flex gap-1 items-center justify-around bg-linear-to-r bg-neutral-950/80 shadow-xl shadow-neutral-950/20",
  {
    variants: {
      size: {
        default: "text-xs",
        small: "text-[10px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const starSizeVariants = {
  default: 14,
  small: 12,
};

const avatarSizeVariants = cva(
  "",
  {
    variants: {
      size: {
        default: "h-10 w-10",
        small: "h-6 w-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const footerTextVariants = cva(
  "px-2 hover:underline",
  {
    variants: {
      size: {
        default: "text-md",
        small: "text-[10px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const paddingVariants = cva(
  "h-full flex flex-col pb-2",
  {
    variants: {
      size: {
        default: "px-4",
        small: "px-2",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const titleZoneVariants = cva(
  "shrink-0",
  {
    variants: {
      size: {
        default: "pt-4",
        small: "pt-2",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const descriptionZoneVariants = cva(
  "flex-1 max-h-0 group-hover:max-h-full opacity-0 group-hover:opacity-100 transition-all duration-300 overflow-y-scroll scrollbar-hide pr-1",
  {
    variants: {
      size: {
        default: "mt-2",
        small: "mt-1",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface CourseCardResponse extends CourseResponse {
  totalSections?: number;
  completedSections?: number;
  size?: "default" | "small";
}

export const CourseCard: FC<CourseCardResponse> = ({
  courseName,
  courseDescription,
  createdBy,
  createdById,
  courseId,
  completedSections,
  totalSections,
  imagePath,
  totalRatings,
  averageRating,
  size = "default",
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const navigate = useNavigate();
  const creatorInfo = useUser(createdById);

  return (
    <Card
      className={courseCardVariants({ size })}
      onClick={() => navigate(`/course/${courseId}`)}
    >
      {!isImageLoaded && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}

      <img
        draggable={false}
        src={imageUrl + imagePath}
        alt={courseName}
        onLoad={() => setIsImageLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-500 ${
          isImageLoaded ? "opacity-100" : "opacity-0"
        } group-hover:scale-120 scale-110`}
      />

      <div className={ratingBadgeVariants({ size })}>
        <Star size={starSizeVariants[size]} className="fill-yellow-400/60" color="none" />
        {averageRating.toFixed(1)} <span className="text-neutral-400">({totalRatings})</span>
      </div>

      {/* Overlay */}
      <div className={overlayVariants({ size })}>
        {/* 3-zone layout */}
        <div className={paddingVariants({ size })}>
          {/* TITLE ZONE (fixed) */}
          {totalSections != null && completedSections != null && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-neutral-700/20 overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{
                  width: `${totalSections > 0 ? (completedSections / totalSections) * 100 : 0}%`,
                }}
              />
            </div>
          )}
          <div className={titleZoneVariants({ size })}>
            <CardTitle className={titleVariants({ size })}>
              {courseName}
            </CardTitle>
          </div>

          {/* DESCRIPTION ZONE (largest) - Only visible on hover */}
          <div className={descriptionZoneVariants({ size })}>
            <CardDescription className={descriptionVariants({ size })}>
              {courseDescription}
            </CardDescription>
          </div>

          {/* FOOTER ZONE (fixed) - Only visible on hover */}
          <div
            className="
              m-0 p-0 shrink-0
              max-h-0 group-hover:max-h-[100px]
              opacity-0 group-hover:opacity-100
              transition-all duration-300
              overflow-hidden
            "
          >
            <CardFooter className="p-0 text-white/80 text-xs m-0">
              <Avatar className={avatarSizeVariants({ size })}>
                <AvatarImage src={imageUrl + creatorInfo.data?.imagePath} className="rounded-full" />
                <AvatarFallback className={`bg-black ${size === "small" ? "text-[10px]" : "text-xs"}`}>
                  {createdBy.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Link 
                to={`/user/profile/${createdById}`} 
                onClick={(e) => { 
                  e.preventDefault(); 
                  e.stopPropagation(); 
                  navigate(`/user/profile/${createdById}`); 
                }}
              >
                <p className={footerTextVariants({ size })}>{createdBy}</p>
              </Link>
            </CardFooter>
          </div>
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
