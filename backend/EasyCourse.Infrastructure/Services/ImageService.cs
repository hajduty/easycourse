using EasyCourse.Core.DTO.Image;
using EasyCourse.Core.Entities;
using EasyCourse.Core.Interfaces.Repository;
using EasyCourse.Core.Interfaces.Service;
using Microsoft.AspNetCore.Http;

namespace EasyCourse.Infrastructure.Services;

public class ImageService(
    IImageRepository repo,
    IObjectStorage storage
) : IImageService
{
    private const string Prefix = "images/originals";

    public async Task<ImageDto> UploadImageAsync(IFormFile file, Guid userId)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("File is empty");

        var id = Guid.NewGuid();
        var ext = Path.GetExtension(file.FileName);
        var key = $"{Prefix}/{id}{ext}";

        using var stream = file.OpenReadStream();
        await storage.UploadAsync(key, stream, file.ContentType);

        var image = new Image
        {
            Id = id,
            Path = key,
            UploadedBy = userId
        };

        var result = await repo.CreateById(image);
        return ToDto(result);
    }

    public async Task DeleteAsync(Guid id, Guid userId)
    {
        var image = await GetMetadataAsync(id);

        if (image.UploadedBy != userId)
            throw new UnauthorizedAccessException();

        await storage.DeleteAsync(image.Path);
        await repo.DeleteById(id);
    }

    public async Task<ImageDto> GetMetadataAsync(Guid id)
    {
        var image = await repo.GetById(id)
            ?? throw new FileNotFoundException();

        return ToDto(image);
    }

    private ImageDto ToDto(Image image)
        => new ImageDto
        {
            Id = image.Id,
            Path = storage.GetPublicUrl(image.Path),
            UploadedBy = image.UploadedBy,
        };
}