using EasyCourse.Core.DTO;
using EasyCourse.Core.DTO.Course;
using EasyCourse.Core.Entities;
using EasyCourse.Core.Interfaces.Repository;
using EasyCourse.Core.Interfaces.Service;
using EasyCourse.Core.Mappings;

namespace EasyCourse.Infrastructure.Services;

public class CourseService(ICourseRepository courseRepo, IRatingRepository ratingRepo) : ICourseService
{
    public async Task<CourseResponse> CreateCourse(CourseRequest newCourse, Guid userId)
    {
        var entity = CourseMappings.ToEntity(newCourse, userId, null);

        var course = await courseRepo.CreateCourse(entity);

        return course.ToResponseDto(null) ?? throw new InvalidOperationException("Failed to create course.");
    }

    public async Task<bool> DeleteCourseById(Guid courseId, Guid userId)
    {
        var course = await courseRepo.GetCourseById(courseId);

        if (course != null && course.CreatedByUserId != userId)
            throw new UnauthorizedAccessException("You do not have permission to delete this course.");

        var result = await courseRepo.DeleteCourseById(courseId);

        return result;
    }

    public async Task<CourseResponse?> GetCourseById(Guid courseId)
    {
        var course = await courseRepo.GetCourseById(courseId) ?? throw new InvalidOperationException("Course not found");

        var ratings = await ratingRepo.GetRatingsByEntity("course", courseId.ToString());

        return CourseMappings.ToResponseDto(course, ratings);
    }

    public async Task<PagedResponse<CourseResponse>> GetCoursesAsync(CourseQuery query)
    {
        var (courses, totalCount) = await courseRepo.GetAndFilterCoursesAsync(query);

        var courseIds = courses.Select(c => c.CourseId.ToString()).ToList();
        var ratings = await ratingRepo.GetRatingsByEntities("Course", courseIds);

        var ratingsGrouped = ratings
            .GroupBy(r => r.EntityId)
            .ToDictionary(g => g.Key, g => g.ToList());

        var courseResponses = courses.Select(c =>
        {
            ratingsGrouped.TryGetValue(c.CourseId.ToString(), out var courseRatings);
            return c.ToResponseDto(courseRatings);
        }).ToList();

        return new PagedResponse<CourseResponse>(courseResponses, totalCount, query.Page, query.PageSize);
    }

    public async Task<IEnumerable<CourseResponse>> GetCoursesByUserId(Guid userId, Guid? requestId)
    {
        var courses = await courseRepo.GetCoursesByUserId(userId);

        if (courses == null || !courses.Any())
            throw new InvalidOperationException("No courses found for this user.");

        if (requestId != userId)
        {
            courses = [.. courses.Where(c => c.IsPublic == true)];
        }

        var courseIds = courses.Select(c => c.CourseId.ToString()).ToList();
        var ratings = await ratingRepo.GetRatingsByEntities("Course", courseIds);

        return courses.ToResponseDto(ratings);
    }

    public async Task<CourseResponse> UpdateCourse(CourseRequest updatedCourse, Guid userId, Guid courseId)
    {
        var course = await courseRepo.GetCourseById(courseId);

        if (course == null || course.CreatedByUserId != userId)
            throw new InvalidOperationException($"Course not found for user with ID {userId}");

        var result = await courseRepo.UpdateCourse(updatedCourse.ToEntity(userId, courseId));

        return result.ToResponseDto(null) ?? throw new InvalidOperationException("Error updating course");
    }
}
