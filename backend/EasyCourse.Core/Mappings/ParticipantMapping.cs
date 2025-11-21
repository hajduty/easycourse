using EasyCourse.Core.DTO;
using EasyCourse.Core.Entities;

namespace EasyCourse.Core.Mappings;

public static class ParticipantMapping
{
    public static CourseParticipantDto ToDto(this CourseParticipant participant)
    {
        return new CourseParticipantDto
        {
            CompletedSectionIds = participant.CompletedSectionIds,
            CourseId = participant.CourseId,
            UserId = participant.UserId,
            LastCompletedSectionId = participant.LastCompletedSectionId
        };
    }

    public static CourseParticipant ToEntity(this CourseParticipantDto entity)
    {
        return new CourseParticipant
        {
            UserId = entity.UserId,
            LastCompletedSectionId = entity.LastCompletedSectionId,
            CourseId = entity.CourseId,
            CompletedSectionIds = entity.CompletedSectionIds,
        };
    }
}
