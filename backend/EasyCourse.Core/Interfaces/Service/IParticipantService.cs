using EasyCourse.Core.DTO.Participant;

namespace EasyCourse.Core.Interfaces.Service;

public interface IParticipantService
{
    Task<CourseParticipantResponse> RegisterParticipant(CourseParticipantRequest courseParticipant, Guid userId);
    Task<CourseParticipantResponse> GetParticipantInfo(Guid userId, Guid courseId);
    Task<CourseParticipantResponse> UpdateParticipantInfo(CourseParticipantRequest courseParticipant, Guid userId);
    Task<bool> UnregisterParticipant(Guid userId, Guid courseId, Guid requestUserId);
    Task<List<CourseParticipantResponse>> GetUserParticipations(Guid userId);
}