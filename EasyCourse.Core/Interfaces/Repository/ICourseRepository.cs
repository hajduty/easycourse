using EasyCourse.Core.DTO;
using EasyCourse.Core.Entities;

namespace EasyCourse.Core.Interfaces.Repository;

public interface ICourseRepository
{
    Task<CourseDto> CreateCourse(CourseDto newCourse, Guid userId);
    Task<CourseDto?> GetCourseById(Guid courseId);
    Task<IEnumerable<CourseDto>> GetCoursesByUserId(Guid userId);
    Task<bool> UpdateCourse(CourseDto updatedCourse, Guid userId);
    Task<bool> DeleteCourseById(Guid courseId, Guid userId);
    Task<bool> CourseExists(Guid courseId);
    Task<IEnumerable<Course>> SearchCoursesAsync(string query);
}