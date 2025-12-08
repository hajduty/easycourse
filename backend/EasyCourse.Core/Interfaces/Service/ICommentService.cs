using EasyCourse.Core.DTO.Comment;

namespace EasyCourse.Core.Interfaces.Service;

public interface ICommentService
{
    Task<CommentResponse> CreateComment(CommentRequest comment, Guid userId);
    Task<IEnumerable<CommentResponse>> GetCommentsForEntity(string entityType, string entityId);
    Task<CommentResponse> UpdateComment(int commentId, CommentRequest updatedComment, Guid userId);
    Task<bool> DeleteComment(int commentId, Guid userId);
    Task<CommentResponse> GetCommentById(int commentId);
}