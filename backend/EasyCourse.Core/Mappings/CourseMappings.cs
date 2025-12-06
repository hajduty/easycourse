using EasyCourse.Core.DTO.Course;
using EasyCourse.Core.Entities;

namespace EasyCourse.Core.Mappings;

public static class CourseMappings
{
    public static CourseResponse ToResponseDto(this Course course)
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
            AverageRating = (course.Ratings != null && course.Ratings.Any()) ? course.Ratings.Average(r => r.Score) : 0,
            TotalRatings = course.Ratings?.Count ?? 0
        };
    }

    public static List<CourseResponse> ToResponseDto(this IEnumerable<Course> courses)
    {
        return [.. courses.Select(c => c.ToResponseDto())];
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
        };

        if (courseId.HasValue)
        {
            entity.CourseId = courseId.Value;
        }
        
        return entity;
    }

    public static List<Course> ToEntity(this IEnumerable<CourseRequest> courseRequests, Guid userId)
    {
        return [.. courseRequests.Select(cr => cr.ToEntity(userId, null))];
    }
}