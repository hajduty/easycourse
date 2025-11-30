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
        await _context.Database.ExecuteSqlInterpolatedAsync(
            $"UPDATE Courses SET Views = Views + 1 WHERE CourseId = {courseId}");

        return await _context.Courses
            .Include(c => c.CreatedByUser)
            .Include(c => c.CourseImage)
            .FirstOrDefaultAsync(c => c.CourseId == courseId);
    }

    public async Task<IEnumerable<Course>> GetCoursesByUserId(Guid userId)
    {
        return await _context.Courses
            .Where(c => c.CreatedByUserId == userId)
            .Include(c => c.CreatedByUser)
            .Include(c => c.Participants)
            .Include(c => c.CourseImage)
            .ToListAsync();
    }

    public async Task<(IEnumerable<Course> Courses, int TotalCount)> GetAndFilterCoursesAsync(CourseQuery query)
    {
        var baseQuery = _context.Courses.Where(c => c.IsPublic == true).AsQueryable();

        if (!string.IsNullOrEmpty(query.Query))
        {
            baseQuery = baseQuery.Where(c =>
                c.CourseName.Contains(query.Query) ||
                c.CourseDescription.Contains(query.Query));
        }

        if (query.MinParticipants.HasValue)
        {
            baseQuery = baseQuery.Where(c => c.Participants.Count >= query.MinParticipants.Value);
        }

        var totalCount = await baseQuery.CountAsync();

        IQueryable<Course> courseQuery = baseQuery
            .Include(c => c.Participants)
            .Include(c => c.CreatedByUser)
            .Include(c => c.CourseImage);

        courseQuery = query.SortBy?.ToLower() switch
        {
            "coursename" => query.Descending
                ? courseQuery.OrderByDescending(c => c.CourseName)
                : courseQuery.OrderBy(c => c.CourseName),

            "popular" => query.Descending
                ? courseQuery.OrderByDescending(c => c.Participants.Count)
                : courseQuery.OrderBy(c => c.Participants.Count),

            "created" => query.Descending
                ? courseQuery.OrderByDescending(c => c.CreatedAt)
                : courseQuery.OrderBy(c => c.CreatedAt),

            _ => courseQuery.OrderBy(c => c.CreatedAt) // fallback sort
        };

        var courses = await courseQuery
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .AsNoTracking()
            .ToListAsync();

        return (courses, totalCount);
    }

    public async Task<Course> UpdateCourse(Course updatedCourse)
    {
        var getCourse = _context.Courses.Find(updatedCourse.CourseId) ?? throw new KeyNotFoundException($"Course with id {updatedCourse.CourseId} not found.");

        if (updatedCourse.CourseDescription != "" || updatedCourse.CourseName != "")
        {
            getCourse.CourseName = updatedCourse.CourseName;
            getCourse.CourseDescription = updatedCourse.CourseDescription;
        }

        if (updatedCourse.IsPublic != null)
            getCourse.IsPublic = updatedCourse.IsPublic;

        if (updatedCourse.Sections != null)
            getCourse.Sections = updatedCourse.Sections;

        if (updatedCourse.CourseImageId != null)
            getCourse.CourseImageId = updatedCourse.CourseImageId;

        await _context.SaveChangesAsync();
        return getCourse;
    }
}
