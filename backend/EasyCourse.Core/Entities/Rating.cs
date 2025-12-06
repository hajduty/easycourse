using System.ComponentModel.DataAnnotations;

namespace EasyCourse.Core.Entities;

public class Rating
{
    [Key]
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public string EntityType { get; set; } = null!;
    public string EntityId { get; set; } = null!;
    public Guid UserId { get; set; }
    public int Score { get; set; }
}  