using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace EasyCourse.Core.Entities;

public class Course
{
    [Key]
    public Guid CourseId { get; set; }
    public string CourseName { get; set; }
    public string CourseDescription { get; set; }
    public string CreatedByUserId { get; set; }
    public ICollection<Section> Sections { get; set; }
}