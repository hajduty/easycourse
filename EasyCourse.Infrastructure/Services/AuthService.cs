using EasyCourse.Core.DTO;
using EasyCourse.Core.Interfaces;

namespace EasyCourse.Infrastructure.Services;

public class AuthService : IAuthService
{
    public Task<AuthResult> LoginUser(string username, string password)
    {
        throw new NotImplementedException();
    }

    public Task<AuthResult> RegisterUser(string username, string password)
    {
        throw new NotImplementedException();
    }
}
