using EasyCourse.Core.Entities;

namespace EasyCourse.Core.Interfaces.Repository;

public interface IRatingRepository
{
    Task<Rating> CreateRating(Rating rating);
    Task<Rating?> GetRatingById(int ratingId);
    Task<IEnumerable<Rating>> GetRatingsByEntity(string entityType, string entityId);
    Task<IEnumerable<Rating>> GetRatingsByEntities(string entityType, List<string> entityIds);
    Task<Rating?> GetUserRatingForEntity(string entityType, string entityId, Guid userId);
    Task<Rating?> UpdateRating(Rating updatedRating);
    Task<bool> DeleteRatingById(int ratingId);
}
