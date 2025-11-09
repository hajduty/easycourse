using EasyCourse.Core.Entities;

namespace EasyCourse.Core.DTO.Course;

public class CourseResponse
{
    public Guid CourseId { get; set; }
    public string CourseName { get; set; } = string.Empty;
    public string CourseDescription { get; set; } = string.Empty;
    public Guid CreatedByUserId { get; set; } = new Guid();
    public ICollection<SectionDto> Sections { get; set; } = [];
    public int ParticipantCount { get; set; }
}