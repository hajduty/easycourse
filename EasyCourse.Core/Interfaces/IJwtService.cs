using EasyCourse.Core.Entities;

namespace EasyCourse.Core.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);
}
