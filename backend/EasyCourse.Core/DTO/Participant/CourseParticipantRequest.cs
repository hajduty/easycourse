namespace EasyCourse.Core.DTO.Participant;

public class CourseParticipantRequest
{
    public Guid UserId { get; set; }
    public Guid CourseId { get; set; }
    public Guid? LastCompletedSectionId { get; set; }
    public List<Guid>? CompletedSectionIds { get; set; } = [];
}
