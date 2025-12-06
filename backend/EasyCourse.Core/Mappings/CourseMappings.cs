using EasyCourse.Core.DTO.Course;
using EasyCourse.Core.Entities;
using System.Runtime.CompilerServices;

namespace EasyCourse.Core.Mappings;

public static class CourseMappings
{
    public static CourseResponse ToResponseDto(this Course course, IEnumerable<Rating>? ratings)
    {
        return new CourseResponse
        {
            CourseId = course.CourseId,
            CourseName = course.CourseName,
            CourseDescription = course.CourseDescription,
            CreatedBy = course.CreatedByUser?.Username,
            CreatedById = course.CreatedByUserId.ToString(),
            Sections = course.Sections?.ToDto() ?? [],
            ParticipantCount = course.Participants?.Count ?? 0,
            CreatedAt = course.CreatedAt,
            IsPublic = course.IsPublic ?? false,
            Views = course.Views,
            ImagePath = course.CourseImage?.Path ?? CourseResponse.DefaultImagePath,
            AverageRating = (ratings != null && ratings.Any()) ? ratings.Average(r => r.Score) : 0,
            TotalRatings = ratings?.Count() ?? 0
        };
    }

    public static List<CourseResponse> ToResponseDto(
        this IEnumerable<Course> courses,
        IEnumerable<Rating>? ratings)
    {
        var ratingsGrouped = ratings?
            .GroupBy(r => r.EntityId)
            .ToDictionary(g => g.Key, g => g.ToList())
            ?? new Dictionary<string, List<Rating>>();

        return courses.Select(c =>
        {
            ratingsGrouped.TryGetValue(c.CourseId.ToString(), out var courseRatings);
            return c.ToResponseDto(courseRatings);
        }).ToList();
    }

    public static Course ToEntity(this CourseRequest courseRequest, Guid userId, Guid? courseId)
    {
        var entity = new Course
        {
            CourseName = courseRequest.CourseName,
            CourseDescription = courseRequest.CourseDescription,
            CreatedByUserId = userId,
            Sections = courseRequest.Sections.ToEntity(),
            IsPublic = courseRequest.IsPublic,
            CourseImageId = null,
            CourseImage = null
        };

        if (courseId.HasValue)
            entity.CourseId = courseId.Value;

        if (courseRequest.ImageId.HasValue && courseRequest.ImageId.Value != Guid.Empty)
            entity.CourseImageId = courseRequest.ImageId;

        return entity;
    }

    public static List<Course> ToEntity(this IEnumerable<CourseRequest> courseRequests, Guid userId)
    {
        return [.. courseRequests.Select(cr => cr.ToEntity(userId, null))];
    }
}