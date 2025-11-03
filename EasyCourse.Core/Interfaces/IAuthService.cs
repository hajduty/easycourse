using EasyCourse.Core.DTO;

namespace EasyCourse.Core.Interfaces;

public interface IAuthService
{
    Task<AuthResult> LoginUser(string email, string password);
    Task<AuthResult> RegisterUser(string email, string password, string username);
}
