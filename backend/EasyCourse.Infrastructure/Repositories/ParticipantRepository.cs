using EasyCourse.Core.Entities;
using EasyCourse.Core.Interfaces.Repository;
using EasyCourse.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EasyCourse.Infrastructure.Repositories;

public class ParticipantRepository(AppDbContext _context) : IParticipantRepository
{
    public async Task<CourseParticipant> CreateParticipant(CourseParticipant participant)
    {
        var result = await _context.CourseParticipant.AddAsync(participant);

        await _context.SaveChangesAsync();

        if (result == null)
            throw new InvalidOperationException("Failed to register participant");

        return result.Entity;
    }

    public async Task<bool> DeleteByIdAsync(Guid courseId, Guid userId)
    {
        var result = await _context.CourseParticipant.Where(c => c.UserId == userId && c.CourseId == courseId).ExecuteDeleteAsync();

        return result > 0;
    }

    public async Task<CourseParticipant> GetParticipant(Guid courseId, Guid userId)
    {
        var result = await _context.CourseParticipant.FindAsync(userId, courseId);

        return result ?? throw new KeyNotFoundException("Failed to get participant for this course");
    }

    public async Task<List<CourseParticipant>> GetUserParticipations(Guid userId)
    {
        var participations = await _context.CourseParticipant.Where(p => p.UserId == userId).ToListAsync() ?? throw new KeyNotFoundException("Failed to get participated courses for this user");

        return participations;
    }

    public async Task<CourseParticipant> UpdateByIdAsync(Guid courseId, Guid userId, CourseParticipant participant)
    {
        var existing = await _context.CourseParticipant
            .FindAsync(userId, courseId);

        if (existing == null)
        {
            existing = new CourseParticipant
            {
                UserId = userId,
                CourseId = courseId
            };
            _context.CourseParticipant.Add(existing);
        }

        existing.CompletedSectionIds = participant.CompletedSectionIds.Count == 0
            ? participant.CompletedSectionIds
            : existing.CompletedSectionIds;

        existing.LastCompletedSectionId = participant.LastCompletedSectionId ?? existing.LastCompletedSectionId;

        await _context.SaveChangesAsync();

        return existing;
    }
}