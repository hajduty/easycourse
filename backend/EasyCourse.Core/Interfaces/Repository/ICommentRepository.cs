using EasyCourse.Core.Entities;

namespace EasyCourse.Core.Interfaces.Repository;

public interface ICommentRepository
{
    Task<Comment> CreateComment(Comment comment);
    Task<IEnumerable<Comment>> GetCommentsForEntity(string entityType, string entityId);
    Task<Comment> GetComment(int commentId);
    Task<Comment> UpdateComment(Comment comment);
    Task<bool> DeleteComment(Comment comment);
}
