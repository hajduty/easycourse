using EasyCourse.Core.DTO;
using EasyCourse.Core.Entities;

namespace EasyCourse.Core.Interfaces;

public interface IUserRepository
{
    Task<User> CreateUser(NewUserRequest user);
    Task GetUserById(Guid id);
    Task DeleteUserById(Guid id);
    Task<bool> UserExists(string? email);
}