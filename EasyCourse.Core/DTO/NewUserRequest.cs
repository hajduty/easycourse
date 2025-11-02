namespace EasyCourse.Core.DTO;

public class NewUserRequest
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string PasswordHash { get; set; }
    public string Email { get; set; }
    public string? GoogleId { get; set; }
}
