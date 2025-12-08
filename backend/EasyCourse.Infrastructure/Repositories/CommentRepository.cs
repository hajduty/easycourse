using EasyCourse.Core.Entities;
using EasyCourse.Core.Interfaces.Repository;
using EasyCourse.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EasyCourse.Infrastructure.Repositories;

public class CommentRepository(AppDbContext db) : ICommentRepository
{
    public async Task<Comment> CreateComment(Comment comment)
    {
        db.Comments.Add(comment);
        await db.SaveChangesAsync();
        return comment;
    }

    public async Task<Comment> GetComment(int commentId)
    {
        var comment = await db.Comments
            .Include(c=> c.User)
                .ThenInclude(u => u.ProfilePicture)
            .FirstOrDefaultAsync(c => c.Id == commentId) ?? throw new InvalidOperationException($"Comment with id {commentId} not found");
        return comment;
    }

    public async Task<bool> DeleteComment(Comment comment)
    {
        db.Comments.Remove(comment);
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Comment>> GetCommentsForEntity(string entityType, string entityId)
    {
        return await db.Comments
            .Where(c => c.EntityId == entityId && c.EntityType == entityType)
            .Include(c => c.User)
                .ThenInclude(u => u.ProfilePicture)
            .ToListAsync();
    }

    public async Task<Comment> UpdateComment(Comment comment)
    {
        var commentToUpdate = await db.Comments.FindAsync(comment.Id) ?? throw new InvalidOperationException($"Comment with id {comment.Id} not found");
        commentToUpdate.Text = comment.Text;
        commentToUpdate.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return commentToUpdate;
    }
}