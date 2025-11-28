namespace EasyCourse.Core.DTO.Section;

public class SectionDto
{
    public Guid SectionId { get; set; }
    public Guid CourseId { get; set; }
    public int Order { get; set; }
    public string Title { get; set; } = string.Empty;

    public string SectionData { get; set; } = string.Empty;
    public string SectionQuestions { get; set; } = string.Empty;
    public int ReadingTime { get; set; } = 0;
    public DateTime? LastUpdated { get; set; } = DateTime.UtcNow;
}
