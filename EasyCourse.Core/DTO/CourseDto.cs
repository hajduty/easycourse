using EasyCourse.Core.Entities;

namespace EasyCourse.Core.DTO;

public class CourseDto
{
    public Guid CourseId { get; set; }
    public string CourseName { get; set; } = string.Empty;
    public string CourseDescription { get; set; } = string.Empty;
    public string CreatedByUserId { get; set; } = string.Empty;
    public ICollection<Section> Sections { get; set; } = [];
}