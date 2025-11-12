export interface CourseResponse {
  courseId: string;
  courseName: string;
  courseDescription: string;
  createdBy: string;
  sections: any[];
  participantCount: number;
  createdAt: Date;
}

export interface CourseRequest {
  courseName: string;
  courseDescription: string;
  sections: any[];
}