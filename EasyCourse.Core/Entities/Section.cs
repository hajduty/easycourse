using System.ComponentModel.DataAnnotations;

namespace EasyCourse.Core.Entities;

public class Section
{
    [Key]
    public Guid SectionId { get; set; }
    public Guid CourseId { get; set; }
    public int Order { get; set; }
    public string Title { get; set; } = string.Empty;

    public string SectionData { get; set; } = string.Empty;
    public string SectionQuestions { get; set; } = string.Empty;
    public Course? Course { get; set; } // navigation property
}