import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Clock, ScrollText, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { imageUrl } from '@/lib/apiClient';
import { useUser } from '@/features/user/hooks/useUser';
import type { CourseResponse } from '@/types/course';
import { StarRating } from '@/features/rating/components/RatingStars';
import type { size } from 'lodash';
import { Separator } from '@/components/ui/separator';
import { formatMinutesToHours } from '@/lib/utils';

type Props = CourseResponse & { className?: string };

export const LargeCourseCard = (props: Props) => {
  const navigate = useNavigate();
  const creator = useUser(props.createdById);

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
          <p className='text-xs text-neutral-400'>{props.averageRating}/5 ({props.totalRatings})</p>
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
        <div className='text-neutral-300 mt-2 flex flex-row gap-4'>
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