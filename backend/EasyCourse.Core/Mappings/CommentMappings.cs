using EasyCourse.Core.DTO.Comment;
using EasyCourse.Core.Entities;

namespace EasyCourse.Core.Mappings;

public static class CommentMappings
{
    public static Comment ToEntity(CommentRequest comment)
    {
        return new Comment
        {
            CreatedAt = DateTime.UtcNow,
            UserId = comment.UserId,
            EntityId = comment.EntityId,
            EntityType = comment.EntityType,
            Text = comment.Text,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public static CommentResponse ToDto(Comment comment)
    {
        return new CommentResponse
        {
            Id = comment.Id,
            CreatedAt = comment.CreatedAt,
            UserId = comment.UserId,
            EntityId = comment.EntityId,
            EntityType = comment.EntityType,
            Text = comment.Text,
            UpdatedAt = comment.UpdatedAt,
            Username = comment.User?.Username ?? string.Empty,
            UserImagePath = comment.User?.ProfilePicture?.Path ?? string.Empty
        };
    }
}