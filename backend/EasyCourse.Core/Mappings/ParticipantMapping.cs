using EasyCourse.Core.DTO.Participant;
using EasyCourse.Core.Entities;

namespace EasyCourse.Core.Mappings;

public static class ParticipantMapping
{
    public static CourseParticipantResponse ToDto(
        this CourseParticipant participant,
        Dictionary<string, List<Rating>>? ratingsGrouped = null)
    {
        var course = participant.Course;

        List<Rating>? courseRatings = null;
        if (course != null && ratingsGrouped != null)
        {
            ratingsGrouped.TryGetValue(course.CourseId.ToString(), out courseRatings);
        }

        return new CourseParticipantResponse
        {
            CompletedSectionIds = participant.CompletedSectionIds,
            CourseId = participant.CourseId,
            UserId = participant.UserId,
            LastCompletedSectionId = participant.LastCompletedSectionId,
            LastCompletedDate = participant.LastCompletedDate,
            Course = course?.ToResponseDto(courseRatings),
            TotalSections = course?.Sections?.Count ?? 0
        };
    }

    public static List<CourseParticipantResponse> ToDto(
        this IEnumerable<CourseParticipant> participantDtos,
        Dictionary<string, List<Rating>>? ratingsGrouped = null)
    {
        return participantDtos.Select(p => p.ToDto(ratingsGrouped)).ToList();
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

    public static List<CourseParticipant> ToEntity(
        this IEnumerable<CourseParticipantRequest> participantDtos)
    {
        return participantDtos.Select(s => s.ToEntity()).ToList();
    }
}
