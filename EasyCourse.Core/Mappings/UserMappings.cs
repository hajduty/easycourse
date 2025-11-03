using EasyCourse.Core.DTO;

namespace EasyCourse.Core.Mappings;

public static class UserMappings
{
    public static UserResult MapToResult(Entities.User user)
    {
        return new UserResult
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
        };
    }
}
