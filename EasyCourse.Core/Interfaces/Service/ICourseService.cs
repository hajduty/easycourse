using EasyCourse.Core.DTO;

namespace EasyCourse.Core.Interfaces.Service;

public interface ICourseService
{
    public Task<CourseDto> CreateCourse(CourseDto newCourse, string userId);
    public Task<CourseDto?> GetCourseById(Guid courseId);
    public Task<IEnumerable<CourseDto>> GetCoursesByUserId(string userId);
    public Task<bool> UpdateCourse(CourseDto updatedCourse, string userId);
    public Task<bool> DeleteCourseById(Guid courseId, string userId);
    public Task<IEnumerable<CourseDto>> SearchCoursesAsync(string query);
}