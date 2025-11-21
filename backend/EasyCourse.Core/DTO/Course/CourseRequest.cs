namespace EasyCourse.Core.DTO.Course;

public class CourseRequest
{
    public string CourseName { get; set; } = string.Empty;
    public string CourseDescription { get; set; } = string.Empty;
    public ICollection<SectionDto> Sections { get; set; } = [];
    public bool? IsPublic { get; set; } = false;
}
