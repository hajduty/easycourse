using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EasyCourse.Core.Entities;

public class Section
{
    [Key]
    public Guid SectionId { get; set; }
    public Guid CourseId { get; set; }
    public int Order { get; set; }
    public string Title { get; set; } = string.Empty;
    public int ReadingTime { get; set; } = 0;

    public string SectionData { get; set; } = string.Empty;
    public string SectionQuestions { get; set; } = string.Empty;
    [JsonIgnore]
    public Course? Course { get; set; } // navigation property
}