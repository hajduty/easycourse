using EasyCourse.Core.Entities;

namespace EasyCourse.Core.Interfaces.Repository;

public interface IRatingRepository
{
    Task<Rating> CreateRating(Rating rating);
    Task<Rating?> GetRatingById(int ratingId);
    Task<IEnumerable<Rating>> GetRatingsByEntity(string entityType, string entityId);
    Task<Rating?> UpdateRating(Rating updatedRating);
    Task<bool> DeleteRatingById(int ratingId);
}
