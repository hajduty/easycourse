using EasyCourse.Core.Entities;
using EasyCourse.Core.Interfaces.Repository;
using EasyCourse.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EasyCourse.Infrastructure.Repositories;

public class RatingRepository(AppDbContext _context) : IRatingRepository
{
    public async Task<Rating> CreateRating(Rating rating)
    {
        _context.Ratings.Add(rating);
        await _context.SaveChangesAsync();
        return rating;
    }

    public async Task<bool> DeleteRatingById(int ratingId)
    {
        var rating = _context.Ratings.Find(ratingId);
        if (rating == null)
            return false;

        _context.Ratings.Remove(rating);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<Rating?> GetRatingById(int ratingId)
    {
        return await _context.Ratings.FindAsync(ratingId);
    }

    public async Task<Rating?> GetUserRatingForEntity(string entityType, string entityId, Guid userId)
    {
        return await _context.Ratings
            .FirstOrDefaultAsync(r => r.EntityType == entityType && r.EntityId == entityId && r.UserId == userId);
    }

    public async Task<IReadOnlyCollection<Rating>> GetRatingsByEntity(string entityType, string entityId)
    {
        return await _context.Ratings
            .Where(r => r.EntityType == entityType && r.EntityId == entityId)
            .ToListAsync();
    }

    public async Task<Rating?> UpdateRating(Rating updatedRating)
    {
        var existing = _context.Ratings.Find(updatedRating.Id);

        if (existing == null) return null;

        existing.Score = updatedRating.Score;
        existing.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return existing;
    }

    public async Task<IReadOnlyCollection<Rating>> GetRatingsByEntities(string entityType, List<string> entityIds)
    {
        return await _context.Ratings
            .Where(r => r.EntityType == entityType && entityIds.Contains(r.EntityId))
            .ToListAsync();
    }
} 