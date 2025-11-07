using EasyCourse.Core.DTO;

namespace EasyCourse.Core.Interfaces.Service;

public interface IUserService
{
    Task<UserResult?> GetUserById(Guid id);
    Task<UserResult?> GetUserByEmail(string email);
    Task DeleteUserById(Guid id);
}
