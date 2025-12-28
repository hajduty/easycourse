using EasyCourse.Core.DTO.Course;
using EasyCourse.Core.Entities;
using EasyCourse.Core.Interfaces.Repository;
using EasyCourse.Core.Mappings;
using EasyCourse.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc.RazorPages;
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
        _context.Courses.Add(newCourse);
        await _context.SaveChangesAsync();
        return newCourse;
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
            .Include(c => c.Participants)
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
        var page = Math.Max(query.Page, 1);
        var pageSize = Math.Clamp(query.PageSize, 1, 100);

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

        var orderedIdsQuery = baseQuery
            .Select(c => new
            {
                c.CourseId,
                PopularityScore =
                    (decimal)c.Views * 0.2m +
                    (decimal)c.Participants.Count * 2m,
                c.CourseName,
                c.CreatedAt
            });

        orderedIdsQuery = query.SortBy?.ToLower() switch
        {
            "coursename" => query.Descending
                ? orderedIdsQuery.OrderByDescending(x => x.CourseName)
                : orderedIdsQuery.OrderBy(x => x.CourseName),

            "popular" => query.Descending
                ? orderedIdsQuery.OrderByDescending(x => x.PopularityScore)
                : orderedIdsQuery.OrderBy(x => x.PopularityScore),

            "created" => query.Descending
                ? orderedIdsQuery.OrderByDescending(x => x.CreatedAt)
                : orderedIdsQuery.OrderBy(x => x.CreatedAt),

            _ => orderedIdsQuery.OrderByDescending(x => x.CreatedAt)
        };

        var pageIds = await orderedIdsQuery
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => x.CourseId)
            .ToListAsync();

        var courses = await _context.Courses
            .Where(c => pageIds.Contains(c.CourseId))
            .Include(c => c.Participants)
            .Include(c => c.CreatedByUser)
            .Include(c => c.CourseImage)
            .AsSplitQuery()
            .AsNoTracking()
            .ToListAsync();

        var orderedCourses = pageIds
            .Join(courses, id => id, c => c.CourseId, (_, c) => c)
            .ToList();

        return (orderedCourses, totalCount);
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