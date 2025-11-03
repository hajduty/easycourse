namespace EasyCourse.Core.DTO;

public class AuthRequest
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string Username { get; set; } = string.Empty;
    public string? GoogleId { get; set; }
}
