using EasyCourse.Core.DTO.User;
using EasyCourse.Core.Entities;
using EasyCourse.Core.Interfaces.Repository;
using EasyCourse.Core.Interfaces.Service;
using EasyCourse.Core.Mappings;

namespace EasyCourse.Infrastructure.Services;

public class UserService(IUserRepository userRepository) : IUserService
{
    /*
    public async Task<UserResult> CreateUser(AuthRequest newUser)
    {
        if (await userRepository.UserExists(newUser.Email))
            throw new InvalidOperationException($"User with email {newUser.Email} already exists.");

        var createdUser = await userRepository.CreateUser(newUser);
        return UserMappings.MapToResult(createdUser);
    }
    */

    /* bad
    public async Task<UserResult> UpdateUser(Guid id, NewUserRequest updatedUser)
    {
        var existingUser = await _userRepository.GetUserById(id);
        if (existingUser == null)
            throw new KeyNotFoundException($"User with id {id} not found.");

        // Update fields
        existingUser.Username = updatedUser.Username;
        existingUser.Email = updatedUser.Email;

        await _userRepository.DeleteUserById(id); // Just an example placeholder
        var newUser = await _userRepository.CreateUser(updatedUser);

        return UserMappings.MapToResult(newUser);
    }
    */

    public async Task<UserResult?> GetOwnUser(Guid requestId)
    {
        var user = await userRepository.GetUserById(requestId);

        return user == null ? null : UserMappings.MapToResult(user);
    }

    public Task<UserResult?> GetUserByEmail(string email)
    {
        throw new NotImplementedException("Not implemented.");
    }

    public async Task<bool> DeleteUserById(Guid id)
    {
        _ = await userRepository.GetUserById(id) ?? throw new KeyNotFoundException($"User with id {id} not found.");

        await userRepository.DeleteUserById(id);

        return true;
    }

    public async Task<UserResult> UpdateUser(Guid userId, UserUpdateRequest userUpdateRequest, Guid requestId)
    {
        if (userId != requestId && userId != userUpdateRequest.Id)
            throw new UnauthorizedAccessException("You can only update your own user.");

        var updatedUser = await userRepository.UpdateUser(UserMappings.UpdateRequestToEntity(userUpdateRequest));

        return UserMappings.MapToResult(updatedUser);
    }

    public async Task<UserResult?> GetPublicUserById(Guid id)
    {
        var user = await userRepository.GetUserById(id) ?? throw new KeyNotFoundException($"User with id {id} not found.");

        user.Email = "";

        return user == null ? null : UserMappings.MapToResult(user);
    }
}