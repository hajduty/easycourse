using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EasyCourse.Core.Entities;

public class Course
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid CourseId { get; set; }
    public required string CourseName { get; set; }
    public required string CourseDescription { get; set; }
    public required Guid CreatedByUserId { get; set; }
    [JsonIgnore]
    public User? CreatedByUser { get; set; }
    public ICollection<Section> Sections { get; set; } = [];
    [JsonIgnore]
    public ICollection<CourseParticipant> Participants { get; set; } = [];
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool? IsPublic { get; set; }
    public int Views { get; set; } = 0;
    public Image? CourseImage { get; set; }
    public Guid? CourseImageId { get; set; }
    public ICollection<Rating> Ratings { get; set; } = [];
}