using System.Text.Json.Serialization;

namespace EasyCourse.Core.Entities;

public class CodeProblem
{
    public Guid Id { get; set; }
    public string Language { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string StarterCode { get; set; } = null!;
    public string? ExpectedOutput { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Guid CreatorId { get; set; }
    [JsonIgnore]
    public User Creator { get; set; } = null!;
}