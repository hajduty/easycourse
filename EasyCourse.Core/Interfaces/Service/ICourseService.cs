using EasyCourse.Core.DTO;

namespace EasyCourse.Core.Interfaces.Service;

public interface ICourseService
{
    public Task<CourseDto> CreateCourse(CourseDto newCourse, Guid userId);
    public Task<CourseDto?> GetCourseById(Guid courseId);
    public Task<IEnumerable<CourseDto>> GetCoursesByUserId(Guid userId);
    public Task<bool> UpdateCourse(CourseDto updatedCourse, Guid userId);
    public Task<bool> DeleteCourseById(Guid courseId, Guid userId);
    public Task<IEnumerable<CourseDto>> SearchCoursesAsync(string query);
}