using System.Text.Json.Serialization;

namespace EasyCourse.Core.Entities;

public class Comment
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Guid UserId { get; set; }
    [JsonIgnore]
    public User User { get; set; } = null!;
    public string EntityId { get; set; } = string.Empty;
    public string EntityType { get; set; } = string.Empty;
}
