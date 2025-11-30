using EasyCourse.Core.DTO.Image;
using EasyCourse.Core.Entities;

namespace EasyCourse.Core.Mappings;

public static class ImageMappings
{
    public static Image ToEntity(this ImageDto image) => new() { Id = image.Id, Path = image.Path, UploadedBy = image.UploadedBy };
    public static ImageDto ToDto(this Image image) => new() { Path = image.Path, Id = image.Id, UploadedBy = image.UploadedBy };
}
