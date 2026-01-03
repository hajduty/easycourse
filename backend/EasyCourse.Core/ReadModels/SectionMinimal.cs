namespace EasyCourse.Core.ReadModels;

public class SectionMinimal
{
    public Guid SectionId { get; set; }
    public Guid CourseId { get; set; }
    public int Order { get; set; }
    public int ReadingTime { get; set; } = 0;
}