using EasyCourse.Core.Entities;

namespace EasyCourse.Core.Interfaces.Service;

public interface IJwtService
{
    string GenerateToken(User user);
}
