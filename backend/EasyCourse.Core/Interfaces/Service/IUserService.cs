using EasyCourse.Core.DTO.Auth;

namespace EasyCourse.Core.Interfaces.Service;

public interface IUserService
{
    Task<UserResult?> GetUserById(Guid id);
    Task<UserResult?> GetUserByEmail(string email);
    Task<bool> DeleteUserById(Guid id);
}
