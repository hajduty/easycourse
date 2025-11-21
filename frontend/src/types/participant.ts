export interface Participant {
    userId: string,
    courseId: string,
    lastCompletedSectionId?: string,
    completedSectionIds?: string[]
}