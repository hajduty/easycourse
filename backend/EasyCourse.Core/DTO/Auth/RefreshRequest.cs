namespace EasyCourse.Core.DTO.Auth;

public class RefreshRequest
{
    public required Guid RefreshTokenId { get; set; }
    public required string RefreshToken { get; set; }
}
