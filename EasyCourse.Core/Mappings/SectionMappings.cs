namespace EasyCourse.Core.Mappings;

public static class SectionMappings
{
    public static DTO.SectionDto ToDto(this Entities.Section section)
    {
        return new DTO.SectionDto
        {
            SectionId = section.SectionId,
            CourseId = section.CourseId,
            Order = section.Order,
            Title = section.Title,
            SectionData = section.SectionData,
            SectionQuestions = section.SectionQuestions
        };
    }

    public static Entities.Section ToEntity(this DTO.SectionDto sectionDto)
    {
        return new Entities.Section
        {
            SectionId = sectionDto.SectionId,
            CourseId = sectionDto.CourseId,
            Order = sectionDto.Order,
            Title = sectionDto.Title,
            SectionData = sectionDto.SectionData,
            SectionQuestions = sectionDto.SectionQuestions
        };
    }
}