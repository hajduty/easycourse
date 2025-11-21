using EasyCourse.Core.DTO;

namespace EasyCourse.Core.Interfaces.Service;

public interface IParticipantService
{
    Task<CourseParticipantDto> RegisterParticipant(CourseParticipantDto courseParticipant, Guid userId);
    Task<CourseParticipantDto> GetParticipantInfo(Guid userId, Guid courseId);
    Task<CourseParticipantDto> UpdateParticipantInfo(CourseParticipantDto courseParticipant, Guid userId);
    Task<bool> UnregisterParticipant(CourseParticipantDto courseParticipant, Guid userId);
}
