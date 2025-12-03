using EasyCourse.Core.DTO.User;
using EasyCourse.Core.Entities;

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
            ImagePath = user.ProfilePicture?.Path ?? UserResult.DefaultImagePath,
            CreatedAt = user.CreatedAt
        };
    }

    public static User UpdateRequestToEntity(DTO.User.UserUpdateRequest request)
    {
        return new User
        {
            Id = request.Id,
            Username = request.Username,
            Email = request.Email,
            ProfilePictureId = request.ImageId,
            CreatedAt = request.CreatedAt,
        };
    }
}
