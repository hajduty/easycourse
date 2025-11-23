import type { CourseResponse } from "./course"

export interface ParticipantResponse {
    userId: string,
    courseId: string,
    lastCompletedSectionId?: string,
    completedSectionIds?: string[],
    lastCompletedDate?: Date
    course?: CourseResponse,
    totalSections?: number, 
}

export interface ParticipateRequest {
    userId: string,
    courseId: string,
    lastCompletedSectionId?: string,
    completedSectionIds?: string[],
}