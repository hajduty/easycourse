using EasyCourse.Core.DTO.Auth;

namespace EasyCourse.Core.Interfaces.Service;

public interface IAuthService
{
    Task<AuthResult> LoginUser(string email, string password);
    Task<AuthResult> RegisterUser(string email, string password, string username);
    Task<AuthResult> RefreshToken(string refreshToken, Guid refreshTokenId);
}
