using EasyCourse.Core.DTO;

namespace EasyCourse.Core.Interfaces;

public interface ICourseService
{
    public Task<CourseDto> CreateCourse(CourseDto newCourse, string userId);
    public Task<CourseDto?> GetCourseById(Guid courseId);
    public Task<IEnumerable<CourseDto>> GetCoursesByUserId(string userId);
    public Task UpdateCourse(CourseDto updatedCourse, string userId);
    public Task DeleteCourseById(Guid courseId, string userId);
    public Task<IEnumerable<CourseDto>> SearchCoursesAsync(string query);
}
