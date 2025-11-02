using EasyCourse.Core.DTO;

namespace EasyCourse.Core.Interfaces;

public interface IAuthService
{
    Task<AuthResult> LoginUser(string username, string password);
    Task<AuthResult> RegisterUser(string username, string password);
}
