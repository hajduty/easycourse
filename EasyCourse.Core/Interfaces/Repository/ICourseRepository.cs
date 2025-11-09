using EasyCourse.Core.DTO.Course;
using EasyCourse.Core.Entities;

namespace EasyCourse.Core.Interfaces.Repository;

public interface ICourseRepository
{
    Task<Course> CreateCourse(Course newCourse);
    Task<Course?> GetCourseById(Guid courseId);
    Task<IEnumerable<Course>> GetCoursesByUserId(Guid userId);
    Task<Course> UpdateCourse(Course updatedCourse);
    Task<bool> DeleteCourseById(Guid courseId);
    Task<bool> CourseExists(Guid courseId);
    Task<IEnumerable<Course>> SearchCoursesAsync(string query);
}