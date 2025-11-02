namespace EasyCourse.Core.Entities;

public class EnrolledCourse
{
    public Guid UserId { get; set; }
    public Guid CourseId { get; set; }
    public Guid? LastCompletedSectionId { get; set; }
}
