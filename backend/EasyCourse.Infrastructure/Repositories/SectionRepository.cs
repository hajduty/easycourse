using EasyCourse.Core.Entities;
using EasyCourse.Core.Interfaces.Repository;
using EasyCourse.Core.ReadModels;
using EasyCourse.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EasyCourse.Infrastructure.Repositories;

public class SectionRepository(AppDbContext context) : ISectionRepository
{
    public async Task<Section> CreateSection(Section section)
    {
        await context.Sections.AddAsync(section);
        await context.SaveChangesAsync();
        return section;
    }

    public async Task<bool> DeleteSectionById(Guid sectionId)
    {
        var section = await context.Sections.FindAsync(sectionId);
        if (section == null) return false;

        context.Sections.Remove(section);
        await context.SaveChangesAsync();
        return true;
    }

    public async Task<Section?> GetSectionById(Guid sectionId)
    {
        return await context.Sections
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.SectionId == sectionId);
    }

    public async Task<IEnumerable<Section>> GetSectionsByCourseId(Guid courseId)
    {
        return await context.Sections
            .AsNoTracking()
            .Where(s => s.CourseId == courseId)
            .OrderBy(o => o.Order)
            .ToListAsync();
    }

    public async Task<IReadOnlyCollection<SectionMinimal>> GetMinimalSectionsByCourseIds(
        IReadOnlyCollection<Guid> courseIds)
    {
        return await context.Sections
            .AsNoTracking()
            .Where(s => courseIds.Contains(s.CourseId))
            .Select(s => new SectionMinimal
            {
                SectionId = s.SectionId,
                CourseId = s.CourseId,
                Order = s.Order,
                ReadingTime = s.ReadingTime
            })
            .ToListAsync();
    }

    public async Task<bool> SectionExists(Guid sectionId)
    {
        return await context.Sections.AnyAsync(s => s.SectionId == sectionId);
    }

    public async Task<Section> UpdateSection(Section section)
    {
        var existing = await context.Sections.FindAsync(section.SectionId);
        if (existing == null) return null;

        existing.LastUpdated = DateTime.UtcNow;
        existing.SectionData = section.SectionData;
        existing.SectionQuestions = section.SectionQuestions;
        existing.Title = section.Title;
        existing.ReadingTime = section.ReadingTime;

        await context.SaveChangesAsync();
        return existing;
    }
}
