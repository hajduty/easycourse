using EasyCourse.Core.DTO;

namespace EasyCourse.Core.Interfaces;

public interface IUserService
{
    Task<UserResult> CreateUser(AuthRequest newUser);
    Task<UserResult?> GetUserById(Guid id);
    Task<UserResult?> GetUserByEmail(string email);
    Task DeleteUserById(Guid id);
}
