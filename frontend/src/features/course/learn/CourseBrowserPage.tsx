import type { CourseQuery } from "@/types/courseQuery";
import { CourseCard } from "../components/CourseCard";
import { CourseFilter } from "../components/CourseFilter";
import { CoursePagination } from "../components/CoursePagination";
import { CourseSearch } from "../components/CourseSearch";
import { use, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetCourses } from "../api";
import { useDebounce } from "use-debounce";
import { useSearchParams } from "react-router";
import { CourseCardSkeleton } from "../components/CourseCardSkeleton";
import { useGetParticipationsByUser } from "../hooks/participant/useGetParticipationsByUser";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useAuth } from "@/providers/AuthProvider";

export const CoursePage = () => {
  const {user} = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isInitialized, useIsInitialized] = useState(false);
  const previousDebouncedQuery = useRef<CourseQuery | null>(null);

  const [query, setQuery] = useState<CourseQuery>({
    query: searchParams.get("query") ?? "",
    page: Number(searchParams.get("page")) || 1,
    pageSize: Number(searchParams.get("pageSize")) || 8,
    sortBy: searchParams.get("sortBy") ?? "Popular",
    descending: searchParams.get("descending") === "true",
  });

  const [debouncedQuery] = useDebounce(query, 200);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["courses", debouncedQuery],
    queryFn: async () => GetCourses(debouncedQuery),
    staleTime: 60_000
    });

  // Only update URL when debounced query actually changes
  useEffect(() => {
    if (!isInitialized) {
      useIsInitialized(true);
      previousDebouncedQuery.current = debouncedQuery;
      return;
    }

    // Only update if something actually changed
    if (JSON.stringify(previousDebouncedQuery.current) !== JSON.stringify(debouncedQuery)) {
      setSearchParams({
        query: debouncedQuery.query!,
        page: String(debouncedQuery.page),
        pageSize: String(debouncedQuery.pageSize),
        sortBy: debouncedQuery.sortBy!,
        descending: String(debouncedQuery.descending),
      });
      previousDebouncedQuery.current = debouncedQuery;
    }
  }, [debouncedQuery, setSearchParams, isInitialized]);

  const courses = data?.data.items ?? [];

  const sortedCourses = [...courses].sort((a, b) => {
    let result = 0;
    switch (query.sortBy) {
      case "Created":
        result =
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        break;

      case "Popular":
        result = (b.participantCount ?? 0) - (a.participantCount ?? 0);
        break;

      default:
        result = 0;
        break;
    }

    return query.descending ? result : -result;
  });

  const isGridLoading = isLoading || isFetching;

  const participations = useGetParticipationsByUser(user?.id!);

  const participatedCourses = participations.data?.data ?? [];
  
/*   console.log(participatedCourses); */

  return (
    <div className="relative flex flex-col gap-8 justify-center items-center pt-8 dark pb-8 h-full">
      <div className="w-full max-w-6xl mx-auto px-4">

        {participations && participatedCourses.length > 0 && (
          <div className="my-12 mb-24 w-full">
            <h2 className="text-white text-2xl font-medium pb-4">Continue where you left off</h2>
            <div className="gap-2 md:gap-4 w-full">
              <Carousel className="w-full lg:max-w-4xl xl:max-w-5xl md:max-w-2xl sm:max-w-xl max-w-xs mx-auto text-white">
                <CarouselContent className="-ml-2 md:ml-0 flex">
                  {participatedCourses.map((course, index) => (
                    <CarouselItem key={index} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 select-none">
                      <CourseCard key={index} {...course.course!} completedSections={course.completedSectionIds?.length} totalSections={course.totalSections} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
        )}

        <h1 className="text-white text-2xl font-medium pb-8">Browse courses created by other users</h1>
        <div className="flex flex-col w-full text-neutral-200 gap-2 md:flex-row md:justify-center items-start transition-all duration-300 ease-in-out">
          <CourseSearch
            value={query.query!}
            onChange={(val) => setQuery((q) => ({ ...q, query: val, page: 1 }))}
          />
          <CourseFilter
            value={query.sortBy!}
            descending={query.descending!}
            onChange={(sortBy, descending) => setQuery((q) => ({ ...q, sortBy, descending }))}
          />
        </div>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 grid-rows-2 gap-4 md:gap-8 w-full mx-auto">
          {isGridLoading
            ? Array.from({ length: 8 }).map((_, i) => <CourseCardSkeleton key={i} />)
            : sortedCourses.map((course, index) => <CourseCard key={index} {...course} />)}
        </div>
      </div>
      <CoursePagination
        pageSize={data?.data.pageSize!}
        hasNextPage={data?.data.hasNextPage!}
        hasPreviousPage={data?.data.hasPreviousPage!}
        totalCount={data?.data.totalItems!}
        totalPages={data?.data.totalPages!}
        page={query.page!}
        onChange={(page, pageSize) => setQuery((q) => ({ ...q, page, pageSize }))}
      />
    </div>
  )
};