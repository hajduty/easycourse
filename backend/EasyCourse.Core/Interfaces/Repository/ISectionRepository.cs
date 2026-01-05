using EasyCourse.Core.DTO;
using EasyCourse.Core.Entities;
using EasyCourse.Core.ReadModels;

namespace EasyCourse.Core.Interfaces.Repository;

public interface ISectionRepository
{
    Task<Section> CreateSection(Section newSection);
    Task<Section?> GetSectionById(Guid sectionId);
    Task<IEnumerable<Section>> GetSectionsByCourseId(Guid courseId);
    Task<Section> UpdateSection(Section updatedSection);
    Task<bool> DeleteSectionById(Guid sectionId);
    Task<bool> SectionExists(Guid sectionId);

    // Returns minimal section info for all sections in a course
    Task<IReadOnlyCollection<SectionMinimal>> GetMinimalSectionsByCourseIds(IReadOnlyCollection<Guid> courseIds);
}