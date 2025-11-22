namespace EasyCourse.Core.Entities;

public class CourseParticipant
{
    public Guid UserId { get; set; }
    public Guid CourseId { get; set; }
    public Course Course { get; set; } = null!;
    public Guid? LastCompletedSectionId { get; set; }
    public List<Guid> CompletedSectionIds { get; set; } = new();
    public DateTime LastCompletedDate { get; set; } = DateTime.UtcNow;
}
