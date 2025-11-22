using EasyCourse.Core.DTO;
using EasyCourse.Core.Interfaces.Repository;
using EasyCourse.Core.Interfaces.Service;
using EasyCourse.Core.Mappings;
using System.ComponentModel.DataAnnotations;

namespace EasyCourse.Infrastructure.Services;

public class ParticipantService(IParticipantRepository _repo) : IParticipantService
{
    public async Task<CourseParticipantDto> GetParticipantInfo(Guid userId, Guid courseId)
    {
        var participant = await _repo.GetParticipant(userId, courseId) ?? throw new KeyNotFoundException("Participant info not found for this user and course");

        return ParticipantMapping.ToDto(participant);
    }

    public async Task<CourseParticipantDto> RegisterParticipant(CourseParticipantDto courseParticipant, Guid userId)
    {
        if (!courseParticipant.UserId.Equals(userId))
        {
            throw new UnauthorizedAccessException("UserId mismatch");
        }

        var participantEntity = ParticipantMapping.ToEntity(courseParticipant);

        var participant = await _repo.CreateParticipant(participantEntity);

        return participant.ToDto();
    }

    public async Task<bool> UnregisterParticipant(Guid userId, Guid courseId, Guid requestUserId)
    {
        if (!userId.Equals(requestUserId))
        {
            throw new UnauthorizedAccessException("UserId mismatch");
        }

        var participant = await _repo.DeleteByIdAsync(courseId, requestUserId);

        return participant;
    }

    public async Task<CourseParticipantDto> UpdateParticipantInfo(CourseParticipantDto courseParticipant, Guid userId)
    {
        if (!courseParticipant.UserId.Equals(userId)) { throw new UnauthorizedAccessException("UserId mismatch"); }

        var entity = ParticipantMapping.ToEntity(courseParticipant);

        var participant = await _repo.UpdateByIdAsync(entity.CourseId, entity.UserId, entity);

        return participant.ToDto();

    }
}
