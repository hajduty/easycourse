using EasyCourse.Core.Entities;

namespace EasyCourse.Core.DTO.Auth;

public class Tokens
{
    public string AccessToken { get; set; } = default!;
    public string RefreshToken { get; set; } = default!;
    public Guid RefreshTokenId { get; set; } = default!;
    public DateTime ExpiresAt { get; set; }
}