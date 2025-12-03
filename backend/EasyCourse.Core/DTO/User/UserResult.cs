namespace EasyCourse.Core.DTO.User;

public class UserResult
{
    public const string DefaultImagePath = "uploads/images/placeholder.jpg";

    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string? Email { get; set; } = string.Empty;
    public string ImagePath { get; set; } = DefaultImagePath;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}