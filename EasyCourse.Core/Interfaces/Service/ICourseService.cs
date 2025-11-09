using EasyCourse.Core.DTO.Course;

namespace EasyCourse.Core.Interfaces.Service;

public interface ICourseService
{
    public Task<CourseResponse> CreateCourse(CourseRequest newCourse, Guid userId);
    public Task<CourseResponse?> GetCourseById(Guid courseId);
    public Task<IEnumerable<CourseResponse>> GetCoursesByUserId(Guid userId);
    public Task<CourseResponse> UpdateCourse(CourseRequest updatedCourse, Guid userId);
    public Task<bool> DeleteCourseById(Guid courseId, Guid userId);
    public Task<IEnumerable<CourseResponse>> SearchCoursesAsync(string query);
}