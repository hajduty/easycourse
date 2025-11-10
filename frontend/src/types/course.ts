export interface CourseResponse {
  courseId: string;
  title: string;
  description: string;
  createdByUserId: string;
  sections: any[];
}

export interface CourseRequest {
  courseName: string;
  courseDescription: string;
  sections: any[];
}