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
            .Include(c => c.CreatedByUser)
            .ToListAsync();
    }

    public async Task<(IEnumerable<Course> Courses, int TotalCount)> GetAndFilterCoursesAsync(CourseQuery query)
    {
        IQueryable<Course> courseQuery = _context.Courses.Include(c => c.Participants).Include(c => c.CreatedByUser).AsNoTracking();

        if (!string.IsNullOrEmpty(query.Query))
        {
            courseQuery = courseQuery.Where(c => c.CourseName.Contains(query.Query) || c.CourseDescription.Contains(query.Query));
        }

        if (query.MinParticipants.HasValue)
        {
            courseQuery = courseQuery.Where(c => c.Participants.Count >= query.MinParticipants.Value);
        }

        try
        {
            var totalCount = await courseQuery.CountAsync();
            if (!string.IsNullOrEmpty(query.SortBy))
            {
                courseQuery = query.SortBy.ToLower() switch
                {
                    "coursename" => query.Descending
                        ? courseQuery.OrderByDescending(c => c.CourseName)
                        : courseQuery.OrderBy(c => c.CourseName),

                    "Popular" => query.Descending
                        ? courseQuery.OrderByDescending(c => c.Participants.Count)
                        : courseQuery.OrderBy(c => c.Participants.Count),

                    "Created" => query.Descending
                        ? courseQuery.OrderByDescending(c => c.CreatedAt)
                        : courseQuery.OrderBy(c => c.CreatedAt),

                    _ => courseQuery
                };
            }

            var courses = await courseQuery
                .Skip((query.Page - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToListAsync();

            return (courses, totalCount);
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while retrieving courses.", ex);
        }
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
