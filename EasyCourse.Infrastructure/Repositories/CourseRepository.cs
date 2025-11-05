using EasyCourse.Core.DTO;
using EasyCourse.Core.Entities;
using EasyCourse.Core.Interfaces;
using EasyCourse.Core.Mappings;
using EasyCourse.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EasyCourse.Infrastructure.Repositories;

public class CourseRepository(AppDbContext _context) : ICourseRepository
{
    public async Task<bool> CourseExists(Guid courseId)
    {
        return await _context.Courses.AnyAsync(c => c.CourseId == courseId);
    }

    public async Task<CourseDto> CreateCourse(CourseDto newCourse, string userId)
    {
        var courseEntity = new Course
        {
            CourseName = newCourse.CourseName,
            CourseDescription = newCourse.CourseDescription,
            CreatedByUserId = userId,
            Sections = newCourse.Sections
        };

        var course = await _context.Courses.AddAsync(courseEntity);

        await _context.SaveChangesAsync();

        if (course == null)
            throw new InvalidOperationException("Failed to create course.");

        return CourseMappings.CourseToDto(course.Entity);
    }

    public async Task DeleteCourseById(Guid courseId, string userId)
    {
        var course = await _context.Courses.FindAsync(courseId) ?? throw new KeyNotFoundException($"Course with id {courseId} not found.");

        _context.Courses.Remove(course);
        await _context.SaveChangesAsync();
    }

    public async Task<CourseDto?> GetCourseById(Guid courseId)
    {
        return await _context.Courses.FindAsync(courseId) is Course course
            ? CourseMappings.CourseToDto(course)
            : null;
    }

    public async Task<IEnumerable<CourseDto>> GetCoursesByUserId(string userId)
    {
        return await _context.Courses
            .Where(c => c.CreatedByUserId == userId)
            .Select(c => CourseMappings.CourseToDto(c))
            .ToListAsync();
    }

    public async Task<IEnumerable<Course>> SearchCoursesAsync(string query)
    {
        return await _context.Courses
            .Where(c => c.CourseName.Contains(query) || c.CourseDescription.Contains(query))
            .ToListAsync();
    }

    public Task UpdateCourse(CourseDto updatedCourse, string userId)
    {
        throw new NotImplementedException();
    }
}
