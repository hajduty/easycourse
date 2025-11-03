using EasyCourse.Core.DTO;
using EasyCourse.Core.Entities;
using EasyCourse.Core.Interfaces;
using EasyCourse.Core.Mappings;
using Microsoft.AspNetCore.Identity;
using System.Security.Authentication;

namespace EasyCourse.Infrastructure.Services;

public class AuthService(IUserRepository userRepository, IJwtService jwtService) : IAuthService
{
    public async Task<AuthResult> LoginUser(string email, string password)
    {
        var user = await userRepository.GetUserByEmail(email);
        if (user == null)
            return AuthResult.Fail("Invalid email or password");

        var hasher = new PasswordHasher<User>();
        var isPasswordValid = hasher.VerifyHashedPassword(user, user.PasswordHash, password);

        if (isPasswordValid != PasswordVerificationResult.Success)
            return AuthResult.Fail("Invalid email or password");

        var token = jwtService.GenerateToken(user);

        if (string.IsNullOrEmpty(token))
            return AuthResult.Fail("Internal error");

        return AuthResult.Ok(token, user.Id.ToString());
    }

    public async Task<AuthResult> RegisterUser(string email, string password, string username)
    {
        if (await userRepository.UserExists(email))
            return AuthResult.Fail("This email is already registered");

        var user = await userRepository.CreateUser(new AuthRequest
        {
            Email = email,
            Password = password,
            Username = username
        });

        var token = jwtService.GenerateToken(user);

        if (string.IsNullOrEmpty(token))
            return AuthResult.Fail("Internal error");

        return AuthResult.Ok(token, user.Id.ToString());
    }
}