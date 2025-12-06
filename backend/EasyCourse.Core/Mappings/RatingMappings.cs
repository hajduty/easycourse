using EasyCourse.Core.DTO.Rating;
using EasyCourse.Core.Entities;

namespace EasyCourse.Core.Mappings;

public static class RatingMappings
{
    public static RatingDto ToDto(this Rating rating)
    {
        return new RatingDto
        {
            Id = rating.Id,
            EntityId = rating.EntityId,
            EntityType = rating.EntityType,
            UserId = rating.UserId,
            Score = rating.Score,
            CreatedAt = rating.CreatedAt,
            UpdatedAt = rating.UpdatedAt
        };
    }

    public static Rating ToEntity(this RatingDto createDto, Guid userId)
    {
        return new Rating
        {
            EntityId = createDto.EntityId,
            EntityType = createDto.EntityType,
            UserId = userId,
            Score = createDto.Score,
            Id = createDto.Id,
            CreatedAt = createDto.CreatedAt,
            UpdatedAt = createDto.UpdatedAt
        };
    }
}