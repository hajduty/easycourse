namespace EasyCourse.Core.DTO.User;

public class UserUpdateRequest
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string? Email { get; set; } = string.Empty;
    public Guid? ImageId { get; set; } = Guid.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}