import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, ScrollText, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { imageUrl } from '@/lib/apiClient';
import { useUser } from '@/features/user/hooks/useUser';
import type { CourseResponse } from '@/types/course';
import { StarRating } from '@/features/rating/components/RatingStars';
import type { size } from 'lodash';
import { Separator } from '@/components/ui/separator';
import { formatMinutesToHours } from '@/lib/utils';

type Props = CourseResponse & { className?: string; isLoading?: boolean };

export const LargeCourseCard = (props: Props) => {
  const navigate = useNavigate();
  const creator = useUser(props.createdById);

  if (props.isLoading) {
    return (
      <Card
        className={
          'relative rounded-xl overflow-hidden p-2 gap-2 w-full' +
          (props.className ?? '')
        }
      >
        <Skeleton className="h-42 w-full rounded-lg" />
        <div className="flex gap-1 items-center">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <div className="flex gap-1 items-center">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-3 w-3/4" />
        </div>
        <div className='mt-2 flex flex-row gap-4'>
          <div className='flex flex-row items-center gap-1'>
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className='flex flex-row items-center gap-1'>
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Link to={`/course/${props.courseId}`}>
      <Card
        className={
          'relative rounded-xl overflow-hidden cursor-pointer group p-2 gap-2 w-full' +
          (props.className ?? '')
        }
        onClick={() => navigate(`/course/${props.courseId}`)}
      >
        <span className='h-42 w-full overflow-hidden rounded-lg p-0 m-0'>
          <img src={imageUrl + props.imagePath} className='h-full w-full object-cover group-hover:scale-110 transition-all duration-200' />
        </span>
        <span className='flex gap-1 items-center'>
          <StarRating initialValue={props.averageRating} readOnly={true} />
          <p className='text-xs text-neutral-400'>{props.averageRating.toFixed(1)}/5 ({props.totalRatings})</p>
        </span>
        <h1 className='line-clamp-1'>{props.courseName}</h1>
        <span className='flex gap-1 items-center'>
          <Avatar className='p-1'>
            <AvatarImage src={imageUrl + creator.data?.imagePath} className="rounded-full" />
            <AvatarFallback className={`bg-black text-xs`}>
              {props.createdBy.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className='text-sm text-neutral-300 font-semibold'>{props.createdBy}</p>
        </span>
        <h2 className='overflow-y-scroll scrollbar-hide text-neutral-400 group-hover:text-neutral-200 transition-all text-sm h-14'>{props.courseDescription}</h2>
        <div className='text-neutral-300 mt-2 mb-1 flex flex-row gap-4'>
          <span className='flex flex-row items-center'>
            <Clock size={'16'} />
            <span className='ml-1 text-xs font-semibold'>{formatMinutesToHours(props.totalReadTime)}</span>
          </span>
          <span className='flex flex-row items-center'>
            <ScrollText size={'16'} />
            <span className='ml-1 text-xs font-semibold'>{props.totalSections} Sections</span>
          </span>
        </div>
      </Card>
    </Link>
  );
};

// Image
// Rating
// Title
// Image, Username
// Description
// TotalTime + Lesson amount