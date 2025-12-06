using EasyCourse.Core.Entities;
using EasyCourse.Core.Interfaces.Repository;
using EasyCourse.Infrastructure.Data;

namespace EasyCourse.Infrastructure.Repositories;
public class ImageRepository(AppDbContext _context) : IImageRepository
{
    public async Task<Image> CreateById(Image image)
    {
        _context.Images.Add(image);
        await _context.SaveChangesAsync();
        return image;
    }

    public async Task<Image> GetById(Guid id)
    {
        return await _context.Images.FindAsync(id);
    }

    public async Task<Image> DeleteById(Guid id)
    {
        var existing = await _context.Images.FindAsync(id);

        if (existing == null) return null;

        _context.Images.Remove(existing);
        await _context.SaveChangesAsync();

        return existing;
    }

    public async Task<Image> UpdateById(Guid id, Image image)
    {
        var existing = await _context.Images.FindAsync(id);

        if (existing == null) return null;

        existing.Path = image.Path;

        await _context.SaveChangesAsync();
        return existing;
    }
}
