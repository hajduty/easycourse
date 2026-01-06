using EasyCourse.Infrastructure.Options;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Minio;
using Minio.DataModel.Args;

namespace EasyCourse.Infrastructure.Data;

public class MinioBucketInitializer
{
    private readonly IMinioClient _client;
    private readonly string _bucket;

    public MinioBucketInitializer(IMinioClient client, IOptions<MinioOptions> options, IConfiguration config)
    {
        _bucket = config["Minio:Bucket"]!;

        _client = client;
    }

    public async Task EnsureBucketAsync()
    {
        var exists = await _client.BucketExistsAsync(
            new BucketExistsArgs().WithBucket(_bucket));

        if (!exists)
        {
            await _client.MakeBucketAsync(
                new MakeBucketArgs().WithBucket(_bucket));
        }

        await _client.SetPolicyAsync(
            new SetPolicyArgs()
                .WithBucket(_bucket)
                .WithPolicy(PublicReadPolicy(_bucket)));
    }

    private static string PublicReadPolicy(string bucket) => $$"""
    {
      "Version": "2012-10-17",
      "Statement": [{
        "Effect": "Allow",
        "Principal": "*",
        "Action": ["s3:GetObject"],
        "Resource": ["arn:aws:s3:::{{bucket}}/*"]
      }]
    }
    """;
}
