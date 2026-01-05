namespace EasyCourse.Core.DTO.CodeProblem;

public class CodeProblemRequest
{
    public string Language { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string StarterCode { get; set; } = null!;
    public string? ExpectedOutput { get; set; }
}
