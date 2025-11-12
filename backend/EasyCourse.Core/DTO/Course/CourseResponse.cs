using EasyCourse.Core.Entities;

namespace EasyCourse.Core.DTO.Course;

public class CourseResponse
{
    public Guid CourseId { get; set; }
    public string CourseName { get; set; } = string.Empty;
    public string CourseDescription { get; set; } = string.Empty;
    public string CreatedBy { get; set; } = string.Empty;
    public ICollection<SectionDto> Sections { get; set; } = [];
    public int ParticipantCount { get; set; }
}