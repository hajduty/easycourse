namespace EasyCourse.Core.DTO.Image;

public class ImageDto
{
    public Guid Id { get; set; }
    public string Path { get; set; }
    public Guid UploadedBy { get; set; }
}
