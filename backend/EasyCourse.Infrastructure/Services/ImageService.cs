using EasyCourse.Core.DTO.Image;
using EasyCourse.Core.Entities;
using EasyCourse.Core.Interfaces.Repository;
using EasyCourse.Core.Interfaces.Service;
using EasyCourse.Core.Mappings;
using EasyCourse.Infrastructure.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace EasyCourse.Infrastructure.Services;

public class ImageService(IImageRepository _repo, IWebHostEnvironment _env) : IImageService
{
    private string Root => Path.Combine(_env.WebRootPath!, "uploads", "images");

    public async Task DeleteAsync(Guid id, Guid userId)
    {
        var existing = await GetMetadataAsync(id);

        if (existing.UploadedBy != userId)
            throw new UnauthorizedAccessException("No access to this resource");

        var fullPath = Path.Combine(_env.WebRootPath, existing.Path);
        if (File.Exists(fullPath))
            File.Delete(fullPath);

        await _repo.DeleteById(id);
    }

    public async Task<byte[]> GetFileBytesAsync(Guid id)
    {
        var image = await GetMetadataAsync(id);

        var fullPath = Path.Combine(_env.WebRootPath, image.Path);

        if (!File.Exists(fullPath))
            throw new FileNotFoundException("Image file not found.");

        return await File.ReadAllBytesAsync(fullPath);
    }

    public async Task<ImageDto> GetMetadataAsync(Guid id)
    {
        var image = await _repo.GetById(id);

        if (image == null)
            throw new FileNotFoundException("Image metadata not found.");

        return ImageMappings.ToDto(image);
    }

    public async Task<ImageDto> UpdateImageAsync(Guid id, IFormFile newFile, Guid userId)
    {
        if (newFile == null || newFile.Length == 0)
            throw new ArgumentException("File is empty");

        var existing = await GetMetadataAsync(id);

        if (existing.UploadedBy != userId)
            throw new UnauthorizedAccessException("No access to this resource");

        var oldFullPath = Path.Combine(_env.WebRootPath, existing.Path);
        if (File.Exists(oldFullPath))
            File.Delete(oldFullPath);

        Directory.CreateDirectory(Root);

        var newFileName = $"{id}{Path.GetExtension(newFile.FileName)}";
        var newFullPath = Path.Combine(Root, newFileName);

        using (var stream = File.Create(newFullPath))
            await newFile.CopyToAsync(stream);

        existing.Path = $"uploads/images/{newFileName}";

        var result = await _repo.UpdateById(id, existing.ToEntity());

        return result.ToDto();
    }

    public async Task<ImageDto> UploadImageAsync(IFormFile file, Guid userId)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("File is empty");

        Directory.CreateDirectory(Root);

        var id = Guid.NewGuid();
        var fileName = $"{id}{Path.GetExtension(file.FileName)}";
        var fullPath = Path.Combine(Root, fileName);

        using (var stream = File.Create(fullPath))
            await file.CopyToAsync(stream);

        var image = new Image
        {
            Id = id,
            Path = $"uploads/images/{fileName}",
            UploadedBy = userId
        };

        var result = await _repo.CreateById(image);

        return result.ToDto();
    }
}