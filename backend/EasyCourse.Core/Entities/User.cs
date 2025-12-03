using System.ComponentModel.DataAnnotations;

namespace EasyCourse.Core.Entities;

public class User
{
    [Key]
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? GoogleId { get; set; }
    public Image? ProfilePicture { get; set; } = null;
    public Guid? ProfilePictureId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}