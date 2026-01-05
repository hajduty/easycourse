using EasyCourse.Core.DTO.Course;
using EasyCourse.Core.Entities;

namespace EasyCourse.Core.Interfaces.Repository;

public interface ICourseRepository
{
    Task<Course> CreateCourse(Course newCourse);
    Task<Course?> GetCourseById(Guid courseId);
    Task<IReadOnlyCollection<Course>> GetCoursesByUserId(Guid userId);
    Task<Course> UpdateCourse(Course updatedCourse);
    Task<bool> DeleteCourseById(Guid courseId);
    Task<bool> CourseExists(Guid courseId);
    Task<(IReadOnlyCollection<Course> Courses, int TotalCount)> GetAndFilterCoursesAsync(CourseQuery query);
}