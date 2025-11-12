export interface CourseQuery {
  query?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  descending?: boolean;
  minParticipants?: number;
}