using EasyCourse.Core.DTO;
using EasyCourse.Core.DTO.Section;
using EasyCourse.Core.Interfaces.Repository;
using EasyCourse.Core.Interfaces.Service;
using EasyCourse.Core.Mappings;

namespace EasyCourse.Infrastructure.Services;

public class SectionService(ICourseRepository courseRepo, ISectionRepository sectionRepo) : ISectionService
{
    public async Task<SectionDto> CreateSection(SectionDto newSection, Guid userId)
    {
        var course = await courseRepo.GetCourseById(newSection.CourseId);

        if (course.CreatedByUserId != userId)
        {
            throw new UnauthorizedAccessException("User is not authorized to add sections to this course.");
        }

        var createdSection = await sectionRepo.CreateSection(SectionMappings.ToEntity(newSection));

        return SectionMappings.ToDto(createdSection);
    }

    public async Task<bool> DeleteSectionById(Guid sectionId, Guid userId)
    {
        var section = await sectionRepo.GetSectionById(sectionId) ?? throw new KeyNotFoundException("Section not found");

        var course = await courseRepo.GetCourseById(section.CourseId) ?? throw new KeyNotFoundException("Course not found");

        if (course.CreatedByUserId != userId)
        {
            throw new UnauthorizedAccessException("User is not authorized to delete sections from this course.");
        }

        return await sectionRepo.DeleteSectionById(sectionId);
    }

    public async Task<SectionDto?> GetSectionById(Guid sectionId)
    {
        var section = await sectionRepo.GetSectionById(sectionId);

        if (section == null)
            throw new KeyNotFoundException("Section not found.");

        return SectionMappings.ToDto(section);
    }

    public async Task<IEnumerable<SectionDto>> GetSectionsByCourseId(Guid courseId)
    {
        var sections = await sectionRepo.GetSectionsByCourseId(courseId);

        if (sections == null)
            return Enumerable.Empty<SectionDto>();

        return sections.Select(SectionMappings.ToDto);
    }

    public Task<SectionDto> UpdateSection(SectionDto updatedSection, Guid userId)
    {
        var course = courseRepo.GetCourseById(updatedSection.CourseId);

        if (course.Result.CreatedByUserId != userId)
        {
            throw new UnauthorizedAccessException("User is not authorized to update sections in this course.");
        }

        var section = sectionRepo.UpdateSection(SectionMappings.ToEntity(updatedSection))
            .ContinueWith(task => SectionMappings.ToDto(task.Result));

        if (section == null)
            throw new KeyNotFoundException("Section not found.");

        return section;
    }
}
