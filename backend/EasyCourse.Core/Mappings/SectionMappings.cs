using EasyCourse.Core.DTO.Section;
using EasyCourse.Core.Entities;

namespace EasyCourse.Core.Mappings;

public static class SectionMappings
{
    public static SectionDto ToDto(this Section section)
    {
        return new SectionDto
        {
            SectionId = section.SectionId,
            CourseId = section.CourseId,
            Order = section.Order,
            Title = section.Title,
            SectionData = section.SectionData,
            SectionQuestions = section.SectionQuestions,
            ReadingTime = section.ReadingTime,
            LastUpdated = section.LastUpdated
        };
    }

    public static Section ToEntity(this SectionDto sectionDto)
    {
        return new Section
        {
            SectionId = sectionDto.SectionId,
            CourseId = sectionDto.CourseId,
            Order = sectionDto.Order,
            Title = sectionDto.Title,
            SectionData = sectionDto.SectionData,
            SectionQuestions = sectionDto.SectionQuestions,
            ReadingTime = sectionDto.ReadingTime,
            LastUpdated = sectionDto.LastUpdated,
        };
    }

    public static List<Section> ToEntity(this IEnumerable<SectionDto> sectionDtos) => [.. sectionDtos.Select(s => s.ToEntity())];

    public static List<SectionDto> ToDto(this IEnumerable<Section> sections) => [.. sections.Select(s => s.ToDto())];
}