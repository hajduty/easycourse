using EasyCourse.Infrastructure.Data;

namespace EasyCourse.API;

public static class MinioSetup
{
    public static WebApplication EnsureMinioBuckets(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var initializer = scope.ServiceProvider.GetRequiredService<MinioBucketInitializer>();
        initializer.EnsureBucketAsync().GetAwaiter().GetResult();
        return app;
    }
}
