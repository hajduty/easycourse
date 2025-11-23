using EasyCourse.Core.DTO.Participant;
using EasyCourse.Core.Interfaces.Repository;
using EasyCourse.Core.Interfaces.Service;
using EasyCourse.Core.Mappings;
using System.ComponentModel.DataAnnotations;

namespace EasyCourse.Infrastructure.Services;

public class ParticipantService(IParticipantRepository _repo) : IParticipantService
{
    public async Task<CourseParticipantResponse> GetParticipantInfo(Guid userId, Guid courseId)
    {
        var participant = await _repo.GetParticipant(userId, courseId) ?? throw new KeyNotFoundException("Participant info not found for this user and course");

        return ParticipantMapping.ToDto(participant);
    }

    public async Task<List<CourseParticipantResponse>> GetUserParticipations(Guid userId)
    {
        var participations = await _repo.GetUserParticipations(userId) ?? throw new KeyNotFoundException("User has not participated in any courses");

        return ParticipantMapping.ToDto(participations);
    }

    public async Task<CourseParticipantResponse> RegisterParticipant(CourseParticipantRequest courseParticipant, Guid userId)
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

    public async Task<CourseParticipantResponse> UpdateParticipantInfo(CourseParticipantRequest courseParticipant, Guid userId)
    {
        if (!courseParticipant.UserId.Equals(userId)) { throw new UnauthorizedAccessException("UserId mismatch"); }

        var entity = ParticipantMapping.ToEntity(courseParticipant);

        var participant = await _repo.UpdateByIdAsync(entity.CourseId, entity.UserId, entity);

        return participant.ToDto();

    }
}
