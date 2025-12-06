using EasyCourse.Core.DTO.Rating;

namespace EasyCourse.Core.Interfaces.Service;

public interface IRatingService
{
    Task<RatingDto> CreateRating(RatingDto newRating, Guid userId);
    Task<RatingDto?> GetRatingById(int ratingId);
    Task<IEnumerable<RatingDto>> GetRatingsByEntity(string entityType, string entityId);
    Task<RatingDto?> UpdateRating(RatingDto updatedRating, Guid userId);
}
