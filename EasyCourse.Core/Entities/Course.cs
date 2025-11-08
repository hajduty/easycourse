using System.ComponentModel.DataAnnotations;

namespace EasyCourse.Core.Entities;

public class Course
{
    [Key]
    public Guid CourseId { get; set; }
    public required string CourseName { get; set; }
    public required string CourseDescription { get; set; }
    public required Guid CreatedByUserId { get; set; }
    public ICollection<Section> Sections { get; set; } = [];
}