import type { CourseQuery } from "@/types/courseQuery";
import { Navbar } from "../home/components/Navbar";
import { CourseCard } from "./components/CourseCard";
import { CourseFilter } from "./components/CourseFilter";
import { CoursePagination } from "./components/CoursePagination";
import { CourseSearch } from "./components/CourseSearch";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetCourses } from "./api";
import { useDebounce } from "use-debounce";
import { useSearchParams } from "react-router";

export const CoursePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState<CourseQuery>({
    query: searchParams.get("query") ?? "",
    page: Number(searchParams.get("page")) || 1,
    pageSize: Number(searchParams.get("pageSize")) || 8,
    sortBy: searchParams.get("sortBy") ?? "Popular",
    descending: searchParams.get("descending") === "true",
  });

  const [debouncedQuery] = useDebounce(query, 200);

  const { data } = useQuery({
    queryKey: ["courses", debouncedQuery],
    queryFn: async () => GetCourses(debouncedQuery),
    staleTime: 0,
  });

  useEffect(() => {
    setSearchParams({
      query: query.query!,
      page: String(query.page),
      pageSize: String(query.pageSize),
      sortBy: query.sortBy!,
      descending: String(query.descending),
    });
  }, [query, setSearchParams]);

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

  return (
    <>
      <Navbar></Navbar>
      <div className="relative flex flex-col gap-8 justify-center items-center pt-16 dark">
        <div className="w-full max-w-6xl mx-auto px-4">
        <h1 className="text-white text-2xl font-medium pb-8">Browse courses created by other users</h1>
          <div className="flex flex-col w-full text-stone-200 gap-2 md:flex-row md:justify-center items-start transition-all duration-300 ease-in-out">
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
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-fit mx-auto">
            {sortedCourses.map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
          </div>
        </div>
        <CoursePagination
          pageSize={data?.data.pageSize!}
          hasNextPage={data?.data.hasNextPage!}
          hasPreviousPage={data?.data.hasPreviousPage!}
          totalCount={data?.data.totalItems!}
          totalPages={data?.data.totalPages!}
          page={query.page!}
          onChange={(page, pageSize) => setQuery((q) => ({...q, page, pageSize }))}
        />
      </div>
    </>
  )
};