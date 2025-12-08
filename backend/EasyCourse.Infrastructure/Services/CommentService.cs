using EasyCourse.Core.DTO.Comment;
using EasyCourse.Core.Interfaces.Repository;
using EasyCourse.Core.Interfaces.Service;
using EasyCourse.Core.Mappings;

namespace EasyCourse.Infrastructure.Services;

public class CommentService(ICommentRepository repo) : ICommentService
{
    public async Task<CommentResponse> GetCommentById(int commentId)
    {
        var comment = await repo.GetComment(commentId);
        return CommentMappings.ToDto(comment);
    }

    public async Task<CommentResponse> CreateComment(CommentRequest comment, Guid userId)
    {
        comment.UserId = userId;
        var result = await repo.CreateComment(CommentMappings.ToEntity(comment));

        if (result == null)
            throw new InvalidOperationException("Failed to create comment.");

        return CommentMappings.ToDto(result);
    }

    public async Task<bool> DeleteComment(int commentId, Guid userId)
    {
        var comment = await repo.GetComment(commentId);
        if (comment.UserId != userId)
            throw new UnauthorizedAccessException("You are not authorized to delete this comment.");
        return await repo.DeleteComment(comment);
    }

    public async Task<IEnumerable<CommentResponse>> GetCommentsForEntity(string entityType, string entityId)
    {
        var comments = await repo.GetCommentsForEntity(entityType, entityId);

        return comments.Select(CommentMappings.ToDto);
    }

    public async Task<CommentResponse> UpdateComment(int commentId, CommentRequest updatedComment, Guid userId)
    {
        var comment = await repo.GetComment(commentId); 
        if (comment.UserId != userId) 
        {
            throw new UnauthorizedAccessException("You are not authorized to update this comment");
        }

        var updateComment = await repo.UpdateComment(CommentMappings.ToEntity(updatedComment));

        return CommentMappings.ToDto(updateComment);
    }
}