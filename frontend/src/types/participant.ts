import type { CourseResponse } from "./course"

export interface Participant {
    userId: string,
    courseId: string,
    lastCompletedSectionId?: string,
    completedSectionIds?: string[],
    lastCompletedDate?: Date
    course?: CourseResponse
}