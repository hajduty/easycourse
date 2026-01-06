using EasyCourse.Core.DTO.Section;
using EasyCourse.Core.Entities;

namespace EasyCourse.Core.DTO.Course;

public class CourseResponse
{
    public const string DefaultImagePath = "images/originals/placeholder.jpg";

    public Guid CourseId { get; set; }
    public string CourseName { get; set; } = string.Empty;
    public string CourseDescription { get; set; } = string.Empty;
    public string? CreatedBy { get; set; } = string.Empty;
    public string? CreatedById {  get; set; } = string.Empty;
    public ICollection<SectionDto> Sections { get; set; } = [];
    public int ParticipantCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsPublic { get; set; } = false;
    public int Views {  get; set; }
    public string ImagePath { get; set; } = DefaultImagePath;
    public double AverageRating { get; set; }

    public int TotalRatings { get; set; }
    public int? TotalSections { get; set; }
    public int? TotalReadTime { get; set; }
}