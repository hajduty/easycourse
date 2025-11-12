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
            CreatedBy = course.CreatedByUser.Username,
            Sections = course.Sections.ToDto(),
            ParticipantCount = course.Participants?.Count ?? 0
        };
    }

    public static List<CourseResponse> ToResponseDto(this IEnumerable<Course> courses)
    {
        return courses.Select(c => c.ToResponseDto()).ToList();
    }

    public static Course ToEntity(this CourseRequest courseRequest, Guid userId)
    {
        return new Course
        {
            CourseName = courseRequest.CourseName,
            CourseDescription = courseRequest.CourseDescription,
            CreatedByUserId = userId,
            Sections = courseRequest.Sections.ToEntity()
        };
    }

    public static List<Course> ToEntity(this IEnumerable<CourseRequest> courseRequests, Guid userId)
    {
        return courseRequests.Select(cr => cr.ToEntity(userId)).ToList();
    }
}
