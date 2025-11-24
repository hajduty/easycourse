using EasyCourse.Core.DTO.Auth;
using EasyCourse.Core.Entities;
using EasyCourse.Core.Interfaces.Service;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace EasyCourse.Infrastructure.Services;

public class JwtService(IConfiguration config) : IJwtService
{
    public Tokens GenerateToken(User user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };
        
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddHours(int.Parse(config["Jwt:ExpireHours"]!));

        var descriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = expires,
            Issuer = config["Jwt:Issuer"],
            Audience = config["Jwt:Audience"],
            SigningCredentials = creds
        };

        var handler = new JsonWebTokenHandler();
        var token = handler.CreateToken(descriptor);
        var refreshToken = GenerateRefreshToken();

        return new Tokens
        {
            AccessToken = token,
            RefreshToken = refreshToken,
            ExpiresAt = expires
        };
    }

    private static string GenerateRefreshToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
    }
}
