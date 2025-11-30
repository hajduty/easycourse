using EasyCourse.Core.DTO.Image;
using EasyCourse.Core.Entities;
using Microsoft.AspNetCore.Http;

namespace EasyCourse.Core.Interfaces.Service;

public interface IImageService
{
    Task<ImageDto> UploadImageAsync(IFormFile file, Guid userId);
    Task<ImageDto> GetMetadataAsync(Guid id);
    Task<byte[]> GetFileBytesAsync(Guid id);
    Task<ImageDto> UpdateImageAsync(Guid id, IFormFile newFile, Guid userId);
    Task DeleteAsync(Guid id, Guid userId);
}