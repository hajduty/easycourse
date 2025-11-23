using EasyCourse.Core.DTO.Auth;
using EasyCourse.Core.Entities;

namespace EasyCourse.Core.Interfaces.Service;

public interface IJwtService
{
    Tokens GenerateToken(User user);
}
