using EasyCourse.Core.DTO;

namespace EasyCourse.Core.Interfaces.Service;

public interface ISectionService
{
    Task<SectionDto> CreateSection(SectionDto newSection, Guid userId);
    Task<SectionDto?> GetSectionById(Guid sectionId);
    Task<IEnumerable<SectionDto>> GetSectionsByCourseId(Guid courseId);
    Task<SectionDto> UpdateSection(SectionDto updatedSection, Guid userId);
    Task<bool> DeleteSectionById(Guid sectionId, Guid userId);
}