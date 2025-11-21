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

        if (result == null)
            throw new KeyNotFoundException("Failed to get participant for this course");

        return result;
    }

    public async Task<CourseParticipant> UpdateByIdAsync(Guid courseId, Guid userId, CourseParticipant participant)
    {
        var oldParticipant = await _context.CourseParticipant.FindAsync(userId, courseId) ?? throw new KeyNotFoundException($"Participant with id {userId} for course {courseId} not found");

        if (participant.CompletedSectionIds.Any()) {
            oldParticipant.CompletedSectionIds = participant.CompletedSectionIds;
        }

        if (participant.LastCompletedSectionId != null) {
            oldParticipant.LastCompletedSectionId = participant.LastCompletedSectionId;
        }

        await _context.SaveChangesAsync();

        return oldParticipant;
    }
}
