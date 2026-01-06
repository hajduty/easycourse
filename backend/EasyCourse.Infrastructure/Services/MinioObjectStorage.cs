using EasyCourse.Core.Interfaces.Service;
using EasyCourse.Infrastructure.Options;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Minio;
using Minio.DataModel.Args;

namespace EasyCourse.Infrastructure.Services;

public class MinioObjectStorage : IObjectStorage
{
    private readonly IMinioClient _client;
    private readonly string _bucket;
    private readonly string _publicBaseUrl;

    public MinioObjectStorage(IOptions<MinioOptions> options, IMinioClient client)
    {
        _bucket = options.Value.Bucket;
        _publicBaseUrl = options.Value.PublicBaseUrl;
        _client = client;
    }

    public async Task UploadAsync(string key, Stream data, string contentType)
    {
        await _client.PutObjectAsync(new PutObjectArgs()
            .WithBucket(_bucket)
            .WithObject(key)
            .WithStreamData(data)
            .WithObjectSize(data.Length)
            .WithContentType(contentType));
    }

    public async Task DeleteAsync(string key)
    {
        await _client.RemoveObjectAsync(
            new RemoveObjectArgs()
                .WithBucket(_bucket)
                .WithObject(key));
    }

    public async Task<Stream> GetAsync(string key)
    {
        var ms = new MemoryStream();
        await _client.GetObjectAsync(new GetObjectArgs()
            .WithBucket(_bucket)
            .WithObject(key)
            .WithCallbackStream(stream => stream.CopyTo(ms)));
        ms.Position = 0;
        return ms;
    }

    public string GetPublicUrl(string key)
        => $"{_publicBaseUrl}/{key}";
}
