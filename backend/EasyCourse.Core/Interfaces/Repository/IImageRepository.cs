using EasyCourse.Core.Entities;

namespace EasyCourse.Core.Interfaces.Repository;

public interface IImageRepository
{
    Task<Image> GetById(Guid id);
    Task<Image> UpdateById(Guid id, Image image);
    Task<Image> DeleteById(Guid id);
    Task<Image> CreateById(Image image);
}