using EasyCourse.Core.DTO;
using EasyCourse.Core.DTO.Course;
using EasyCourse.Core.Interfaces.Repository;
using EasyCourse.Core.Interfaces.Service;
using EasyCourse.Core.Mappings;

namespace EasyCourse.Infrastructure.Services;

public class CourseService(ICourseRepository courseRepo) : ICourseService
{
    public async Task<CourseResponse> CreateCourse(CourseRequest newCourse, Guid userId)
    {
        var entity = CourseMappings.ToEntity(newCourse, userId, null);

        var course = await courseRepo.CreateCourse(entity);

        return course.ToResponseDto() ?? throw new InvalidOperationException("Failed to create course.");
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
        var course = await courseRepo.GetCourseById(courseId);

        return CourseMappings.ToResponseDto(course) ?? throw new InvalidOperationException("Course does not exist");
    }

    public async Task<PagedResponse<CourseResponse>> GetCoursesAsync(CourseQuery query)
    {
        var (courses, totalCount) = await courseRepo.GetAndFilterCoursesAsync(query);

        var response = courses.ToResponseDto();

        return new PagedResponse<CourseResponse>(response, totalCount, query.Page, query.PageSize);
    }

    public async Task<IEnumerable<CourseResponse>> GetCoursesByUserId(Guid userId, Guid? requestId)
    {
        var courses = await courseRepo.GetCoursesByUserId(userId);

        if (courses == null || !courses.Any())
            throw new InvalidOperationException("No courses found for this user.");

        if (requestId != userId)
        {
            courses = courses.Where(c => c.IsPublic == true).ToList();
        }

        return courses.ToResponseDto();
    }

    public async Task<CourseResponse> UpdateCourse(CourseRequest updatedCourse, Guid userId, Guid courseId)
    {
        var course = await courseRepo.GetCourseById(courseId);

        if (course == null || course.CreatedByUserId != userId)
            throw new InvalidOperationException($"Course not found for user with ID {userId}");

        var result = await courseRepo.UpdateCourse(updatedCourse.ToEntity(userId, courseId));

        return result.ToResponseDto() ?? throw new InvalidOperationException("Error updating course");
    }
}
