export interface Rating {
    id?: number,
    createdAt?: Date,
    updatedAt?: Date,
    userId?: string,
    entityId?: string,
    entityType?: "Course" | "Lesson" | "Quiz",
    score?: number
}