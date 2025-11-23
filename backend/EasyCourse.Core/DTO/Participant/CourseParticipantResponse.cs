using EasyCourse.Core.DTO.Course;

namespace EasyCourse.Core.DTO.Participant;

public class CourseParticipantResponse
{
    public Guid UserId { get; set; }
    public Guid CourseId { get; set; }
    public Guid? LastCompletedSectionId { get; set; }
    public List<Guid>? CompletedSectionIds { get; set; } = [];
    public DateTime LastCompletedDate { get; set; } = DateTime.UtcNow;
    public CourseResponse? Course { get; set; } = null!;
    public int? TotalSections { get; set; }
}