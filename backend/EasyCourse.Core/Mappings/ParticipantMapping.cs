using EasyCourse.Core.DTO.Participant;
using EasyCourse.Core.Entities;

namespace EasyCourse.Core.Mappings;

public static class ParticipantMapping
{
    public static CourseParticipantResponse ToDto(this CourseParticipant participant)
    {
        var course = participant.Course;

        return new CourseParticipantResponse
        {
            CompletedSectionIds = participant.CompletedSectionIds,
            CourseId = participant.CourseId,
            UserId = participant.UserId,
            LastCompletedSectionId = participant.LastCompletedSectionId,
            LastCompletedDate = participant.LastCompletedDate,
            Course = course != null ? course.ToResponseDto() : null,
            TotalSections = course?.Sections?.Count ?? 0
        };
    }

    public static CourseParticipant ToEntity(this CourseParticipantRequest entity)
    {
        return new CourseParticipant
        {
            UserId = entity.UserId,
            LastCompletedSectionId = entity.LastCompletedSectionId,
            CourseId = entity.CourseId,
            CompletedSectionIds = entity.CompletedSectionIds ?? [],
            LastCompletedDate = DateTime.UtcNow
        };
    }

    public static List<CourseParticipant> ToEntity(this IEnumerable<CourseParticipantRequest> participantDtos) => [.. participantDtos.Select(s => s.ToEntity())];

    public static List<CourseParticipantResponse> ToDto(this IEnumerable<CourseParticipant> participantDtos) => [.. participantDtos.Select(s => s.ToDto())];
}
