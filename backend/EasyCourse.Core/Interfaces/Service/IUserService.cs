using EasyCourse.Core.DTO.User;

namespace EasyCourse.Core.Interfaces.Service;

public interface IUserService
{
    Task<UserResult?> GetUserById(Guid id, Guid requestId);
    Task<UserResult?> GetUserByEmail(string email);
    Task<bool> DeleteUserById(Guid id);
    Task<UserResult> UpdateUser(Guid userId, UserUpdateRequest userUpdateRequest, Guid requestId);
}