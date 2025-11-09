using EasyCourse.Core.DTO.Auth;
using EasyCourse.Core.Entities;
using EasyCourse.Core.Interfaces.Repository;
using EasyCourse.Core.Interfaces.Service;
using EasyCourse.Core.Mappings;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.Security.Authentication;

namespace EasyCourse.Infrastructure.Services;

public class AuthService(IUserRepository userRepository, IJwtService jwtService) : IAuthService
{
    public async Task<AuthResult> LoginUser(string email, string password)
    {
        var user = await userRepository.GetUserByEmail(email) ?? throw new ValidationException("Invalid email or password");

        var hasher = new PasswordHasher<User>();
        var isPasswordValid = hasher.VerifyHashedPassword(user, user.PasswordHash, password);

        if (isPasswordValid != PasswordVerificationResult.Success)
            throw new ValidationException("Invalid email or password");

        var token = jwtService.GenerateToken(user);
        if (string.IsNullOrEmpty(token))
            throw new Exception("Failed to generate authentication token");

        return new AuthResult
        {
            Token = token,
            UserId = user.Id.ToString()
        };
    }

    public async Task<AuthResult> RegisterUser(string email, string password, string username)
    {
        if (await userRepository.UserExists(email))
            throw new ValidationException("This email is already registered");

        var user = await userRepository.CreateUser(new AuthRequest
        {
            Email = email,
            Password = password,
            Username = username
        });

        var token = jwtService.GenerateToken(user);
        if (string.IsNullOrEmpty(token))
            throw new Exception("Failed to generate authentication token");

        return new AuthResult
        {
            Token = token,
            UserId = user.Id.ToString()
        };
    }
}