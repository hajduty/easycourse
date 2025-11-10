using EasyCourse.Core.DTO.Course;
using EasyCourse.Core.Entities;
using EasyCourse.Core.Interfaces.Repository;
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

    public async Task<Course> CreateCourse(Course newCourse)
    {
        var course = await _context.Courses.AddAsync(newCourse);

        await _context.SaveChangesAsync();

        if (course == null)
            throw new InvalidOperationException("Failed to create course.");

        return course.Entity;
    }

    public async Task<bool> DeleteCourseById(Guid courseId)
    {
        var course = await _context.Courses.FindAsync(courseId) ?? throw new KeyNotFoundException($"Course with id {courseId} not found.");

        _context.Courses.Remove(course);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<Course?> GetCourseById(Guid courseId)
    {
        return await _context.Courses.FindAsync(courseId);
    }

    public async Task<IEnumerable<Course>> GetCoursesByUserId(Guid userId)
    {
        return await _context.Courses
            .Where(c => c.CreatedByUserId == userId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Course>> SearchCoursesAsync(string query)
    {
        return await _context.Courses
            .Where(c => c.CourseName.Contains(query) || c.CourseDescription.Contains(query))
            .ToListAsync();
    }

    public async Task<Course> UpdateCourse(Course updatedCourse)
    {
        var getCourse = _context.Courses.Find(updatedCourse.CourseId) ?? throw new KeyNotFoundException($"Course with id {updatedCourse.CourseId} not found.");

        getCourse.CourseName = updatedCourse.CourseName;
        getCourse.CourseDescription = updatedCourse.CourseDescription;
        if (updatedCourse.Sections != null)
            getCourse.Sections = updatedCourse.Sections;

        await _context.SaveChangesAsync();
        return getCourse;
    }
}
