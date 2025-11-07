using EasyCourse.Core.DTO;
using EasyCourse.Core.Entities;

namespace EasyCourse.Core.Interfaces.Repository;

public interface IUserRepository
{
    Task<User> CreateUser(AuthRequest user);
    Task<User?> GetUserById(Guid id);
    Task<User?> GetUserByEmail(string email);
    Task DeleteUserById(Guid id);
    Task<bool> UserExists(string? email);
}