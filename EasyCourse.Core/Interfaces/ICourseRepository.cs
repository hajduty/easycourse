using EasyCourse.Core.DTO;
using EasyCourse.Core.Entities;

namespace EasyCourse.Core.Interfaces;

public interface ICourseRepository
{
    Task<CourseDto> CreateCourse(CourseDto newCourse, string userId);
    Task<CourseDto?> GetCourseById(Guid courseId);
    Task<IEnumerable<CourseDto>> GetCoursesByUserId(string userId);
    Task<bool> UpdateCourse(CourseDto updatedCourse, string userId);
    Task<bool> DeleteCourseById(Guid courseId, string userId);
    Task<bool> CourseExists(Guid courseId);
    Task<IEnumerable<Course>> SearchCoursesAsync(string query);
}