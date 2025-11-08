using EasyCourse.Core.DTO;
using EasyCourse.Core.Interfaces.Repository;
using EasyCourse.Core.Interfaces.Service;

namespace EasyCourse.Infrastructure.Services;

public class CourseService(ICourseRepository courseRepo) : ICourseService
{
    public async Task<CourseDto> CreateCourse(CourseDto newCourse, Guid userId)
    {
        var course = await courseRepo.CreateCourse(newCourse, userId);

        return course ?? throw new InvalidOperationException("Failed to create course.");
    }

    public async Task<bool> DeleteCourseById(Guid courseId, Guid userId)
    {
        var course = await courseRepo.GetCourseById(courseId);

        if (course != null && course.CreatedByUserId != userId)
            throw new UnauthorizedAccessException("You do not have permission to delete this course.");

        var result = await courseRepo.DeleteCourseById(courseId, userId);

        return result;
    }

    public async Task<CourseDto?> GetCourseById(Guid courseId)
    {
        var course = await courseRepo.GetCourseById(courseId);

        return course ?? throw new InvalidOperationException("Course does not exist");
    }

    public async Task<IEnumerable<CourseDto>> GetCoursesByUserId(Guid userId)
    {
        var courses = await courseRepo.GetCoursesByUserId(userId);

        return courses == null || !courses.Any() ? throw new InvalidOperationException("No courses found for this user.") : courses;
    }

    public async Task<IEnumerable<CourseDto>> SearchCoursesAsync(string query)
    {
        var courses = await courseRepo.SearchCoursesAsync(query);

        return (IEnumerable<CourseDto>)(courses ?? throw new InvalidOperationException("No courses found matching the query."));
    }

    public Task<bool> UpdateCourse(CourseDto updatedCourse, Guid userId)
    {
        var result = courseRepo.UpdateCourse(updatedCourse, userId);

        return result ?? throw new InvalidOperationException("Error updating course");
    }
}
