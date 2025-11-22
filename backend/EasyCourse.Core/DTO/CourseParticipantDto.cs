using EasyCourse.Core.Entities;

namespace EasyCourse.Core.DTO;

public class CourseParticipantDto
{
    public Guid UserId { get; set; }
    public Guid CourseId { get; set; }
    public Guid? LastCompletedSectionId { get; set; }
    public List<Guid>? CompletedSectionIds { get; set; } = new();
    public DateTime LastCompletedDate { get; set; } = DateTime.UtcNow;
}
