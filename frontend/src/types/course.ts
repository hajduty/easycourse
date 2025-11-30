export interface CourseResponse {
  courseId: string;
  courseName: string;
  courseDescription: string;
  createdBy: string;
  createdById: string;
  sections: any[];
  participantCount: number;
  createdAt: Date;
  isPublic: boolean;
  views: number;
  imagePath: string;
}

export interface CourseRequest {
  courseName?: string;
  courseDescription?: string;
  sections?: any[];
  isPublic?: boolean;
  imageId?: string;
}