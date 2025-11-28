namespace EasyCourse.Core.Entities;

public class Image
{
    public Guid Id { get; set; }
    public string Path { get; set; }
    public Guid UploadedBy { get; set; }
}