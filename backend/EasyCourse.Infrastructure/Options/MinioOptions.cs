namespace EasyCourse.Infrastructure.Options;

public class MinioOptions
{
    public string Endpoint { get; init; } = default!;
    public string AccessKey { get; init; } = default!;
    public string SecretKey { get; init; } = default!;
    public string Bucket { get; init; } = default!;
    public string PublicBaseUrl { get; init; } = default!;
}
