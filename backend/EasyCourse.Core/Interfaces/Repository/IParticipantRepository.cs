using EasyCourse.Core.Entities;

namespace EasyCourse.Core.Interfaces.Repository;

public interface IParticipantRepository
{
    Task<CourseParticipant> CreateParticipant(CourseParticipant participant);
    Task<CourseParticipant> GetParticipant(Guid userId, Guid courseId);
    //Task<CourseParticipant> GetByUserId(Guid userId);
    Task<CourseParticipant> UpdateByIdAsync(Guid courseId, Guid userId, CourseParticipant participant);
    Task<bool> DeleteByIdAsync(Guid courseId, Guid userId);
    Task<List<CourseParticipant>> GetUserParticipations(Guid userId);
}
