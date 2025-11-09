namespace EasyCourse.Core.DTO;

public class SectionDto
{
    public Guid SectionId { get; set; }
    public Guid CourseId { get; set; }
    public int Order { get; set; }
    public string Title { get; set; } = string.Empty;

    public string SectionData { get; set; } = string.Empty;
    public string SectionQuestions { get; set; } = string.Empty;
}
