using EasyCourse.Core.DTO;
using EasyCourse.Core.Entities;

namespace EasyCourse.Core.Interfaces.Repository;

public interface ISectionRepository
{
    Task<Section> CreateSection(Section newSection);
    Task<Section?> GetSectionById(Guid sectionId);
    Task<IEnumerable<Section>> GetSectionsByCourseId(Guid courseId);
    Task<Section> UpdateSection(Section updatedSection);
    Task<bool> DeleteSectionById(Guid sectionId);
    Task<bool> SectionExists(Guid sectionId);
}