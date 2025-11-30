using EasyCourse.Core.DTO.Auth;

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
            ImagePath = user.ProfilePicture?.Path ?? UserResult.DefaultImagePath
        };
    }
}
