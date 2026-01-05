namespace EasyCourse.Core.DTO.CodeProblem;

public class CodeProblemResponse
{
    public Guid Id { get; set; }
    public string Language { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string StarterCode { get; set; } = null!;
    public string? ExpectedOutput { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}