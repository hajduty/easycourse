using EasyCourse.Core.DTO;
using EasyCourse.Core.Entities;
using EasyCourse.Core.Interfaces;

namespace EasyCourse.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    public Task<User> CreateUser(NewUserRequest user)
    {
        throw new NotImplementedException();
    }

    public Task DeleteUserById(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task GetUserById(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task<bool> UserExists(string? email)
    {
        throw new NotImplementedException();
    }
}