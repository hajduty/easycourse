using System.ComponentModel.DataAnnotations;

namespace EasyCourse.Core.DTO.Auth;

public class AuthRequest
{
    [EmailAddress]
    public required string Email { get; set; }
    public required string Password { get; set; }
    public string Username { get; set; } = string.Empty;
    public string? GoogleId { get; set; }
}
