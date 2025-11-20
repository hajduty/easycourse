import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "@/components/ui/pagination"
import type { FC } from "react";

interface CoursePaginationProps {
  page: number,
  pageSize: number,
  totalCount: number,
  totalPages: number,
  hasNextPage: boolean,
  hasPreviousPage: boolean,
  onChange: (page: number, pageSize: number, totalCount: number) => void;
}

export const CoursePagination: FC<CoursePaginationProps> = ({ page, pageSize, totalCount, onChange, hasNextPage, hasPreviousPage, totalPages }) => {
  return (
    <Pagination className="dark text-white">
      <PaginationContent className="text-lg">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={!hasPreviousPage}
            className={`transition-colors ${
              !hasPreviousPage ? "opacity-40 pointer-events-none" : "hover:bg-stone-800"
            }`}
            onClick={(e) => {
              e.preventDefault();
              if (hasPreviousPage) onChange(page - 1, pageSize, totalCount);
            }}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              href="#"
              isActive={p === page}
              onClick={(e) => {
                e.preventDefault();
                onChange(p, pageSize, totalCount);
              }}
              size={"icon-sm"}
              className={` transition-colors ${p === page
                ? "bg-stone-800 text-white"
                : "hover:bg-stone-800 text-stone-300 "
                }`}
            >
              <p className="text-xs">{p}</p>
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={!hasNextPage}
            className={`transition-colors ${
              !hasNextPage ? "opacity-40 pointer-events-none" : "hover:bg-stone-800"
            }`}
            onClick={(e) => {
              e.preventDefault();
              if (hasNextPage) onChange(page + 1, pageSize, totalCount);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}