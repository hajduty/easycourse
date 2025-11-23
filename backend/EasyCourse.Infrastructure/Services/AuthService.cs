using Azure.Core;
using EasyCourse.Core.DTO.Auth;
using EasyCourse.Core.Entities;
using EasyCourse.Core.Interfaces.Repository;
using EasyCourse.Core.Interfaces.Service;
using EasyCourse.Core.Mappings;
using EasyCourse.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Security.Authentication;

namespace EasyCourse.Infrastructure.Services;

public class AuthService(IUserRepository userRepository, IJwtService jwtService, AppDbContext _context) : IAuthService
{
    public async Task<AuthResult> LoginUser(string email, string password)
    {
        var user = await userRepository.GetUserByEmail(email) ?? throw new ValidationException("Invalid email or password");

        var hasher = new PasswordHasher<User>();
        var isPasswordValid = hasher.VerifyHashedPassword(user, user.PasswordHash, password);

        if (isPasswordValid != PasswordVerificationResult.Success)
            throw new ValidationException("Invalid email or password");

        var tokens = jwtService.GenerateToken(user);

        if (tokens == null)
            throw new Exception("Failed to generate authentication token");

        var newRefreshEntity = new RefreshToken
        {
            UserId = user.Id,
            TokenHash = BCrypt.Net.BCrypt.HashPassword(tokens.RefreshToken),
            ExpiresAt = DateTime.UtcNow.AddDays(30)
        };

        _context.RefreshTokens.Add(newRefreshEntity);

        await _context.SaveChangesAsync();

        tokens.RefreshTokenId = newRefreshEntity.Id;

        return new AuthResult
        {
            Tokens = tokens,
            User = UserMappings.MapToResult(user)
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

        var tokens = jwtService.GenerateToken(user);

        if (tokens == null)
            throw new Exception("Failed to generate authentication token");

        var newRefreshEntity = new RefreshToken
        {
            UserId = user.Id,
            TokenHash = BCrypt.Net.BCrypt.HashPassword(tokens.RefreshToken),
            ExpiresAt = DateTime.UtcNow.AddDays(30)
        };

        _context.RefreshTokens.Add(newRefreshEntity); await _context.SaveChangesAsync();

        tokens.RefreshTokenId = newRefreshEntity.Id;

        return new AuthResult
        {
            Tokens = tokens,
            User = UserMappings.MapToResult(user)
        };
    }

    public async Task<AuthResult> RefreshToken(string refreshToken, Guid refreshTokenId)
    {
        if (string.IsNullOrWhiteSpace(refreshToken))
            throw new ValidationException("Refresh token is required");

        var refreshEntity = await _context.RefreshTokens
            .FirstOrDefaultAsync(t => t.Id == refreshTokenId && !t.IsRevoked && t.ExpiresAt > DateTime.UtcNow);

        if (refreshEntity == null)
            throw new AuthenticationException("Invalid or expired refresh token");

        if (!BCrypt.Net.BCrypt.Verify(refreshToken, refreshEntity.TokenHash))
            throw new AuthenticationException("Invalid refresh token");

        var user = await userRepository.GetUserById(refreshEntity.UserId);
        if (user == null)
            throw new AuthenticationException("User not found");

        var newTokens = jwtService.GenerateToken(user);
        if (newTokens == null)
            throw new Exception("Failed to generate authentication token");

        refreshEntity.IsRevoked = true;
        refreshEntity.RevokedAt = DateTime.UtcNow;
        refreshEntity.ReplacedByTokenHash = BCrypt.Net.BCrypt.HashPassword(newTokens.RefreshToken);

        var newRefreshEntity = new RefreshToken
        {
            UserId = user.Id,
            TokenHash = BCrypt.Net.BCrypt.HashPassword(newTokens.RefreshToken),
            ExpiresAt = DateTime.UtcNow.AddDays(30)
        };

        _context.RefreshTokens.Add(newRefreshEntity);
        await _context.SaveChangesAsync();

        newTokens.RefreshTokenId = newRefreshEntity.Id;

        return new AuthResult
        {
            Tokens = newTokens,
            User = UserMappings.MapToResult(user)
        };
    }
}