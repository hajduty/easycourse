using EasyCourse.Core.DTO.Rating;
using EasyCourse.Core.Interfaces.Repository;
using EasyCourse.Core.Interfaces.Service;
using EasyCourse.Core.Mappings;

namespace EasyCourse.Infrastructure.Services;

public class RatingService(IRatingRepository ratingRepo, ICourseRepository courseRepo) : IRatingService
{
    public async Task<RatingDto> CreateRating(RatingDto newRating, Guid userId)
    {
        var result = await ratingRepo.CreateRating(newRating.ToEntity(userId)) ?? throw new KeyNotFoundException("Failed to create rating.");

        return result.ToDto();
    }

    public async Task<RatingDto?> GetRatingById(int ratingId)
    {
        var result = await ratingRepo.GetRatingById(ratingId) ?? throw new KeyNotFoundException($"Rating with id {ratingId} not found.");

        return result.ToDto();
    }

    public async Task<IEnumerable<RatingDto>> GetRatingsByEntity(string entityType, string entityId)
    {
        var result = await ratingRepo.GetRatingsByEntity(entityType, entityId) ?? throw new KeyNotFoundException("No ratings found for this entity.");

        return result.Select(r => r.ToDto());
    }

    public async Task<RatingDto?> GetUserRating(string entityType, string entityId, Guid userId)
    {
        var result = await ratingRepo.GetUserRatingForEntity(entityType, entityId, userId) ?? throw new KeyNotFoundException("Rating not found for this user and entity.");

        return result.ToDto();
    }

    public async Task<RatingDto?> UpdateRating(RatingDto updatedRating, Guid userId)
    {
        var result = await ratingRepo.UpdateRating(updatedRating.ToEntity(userId)) ?? throw new KeyNotFoundException($"Rating with id {updatedRating.Id} not found.");

        return result.ToDto();
    }


}