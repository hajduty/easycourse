using EasyCourse.Core.Interfaces.Repository;
using EasyCourse.Core.Interfaces.Service;
using EasyCourse.Infrastructure.Data;
using EasyCourse.Infrastructure.Options;
using EasyCourse.Infrastructure.Repositories;
using EasyCourse.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Minio;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;

namespace EasyCourse.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        services.AddSingleton<IJwtService, JwtService>();

        services.AddDbContext<AppDbContext>(options =>
            options.UseMySql(config.GetConnectionString("DefaultConnection"), ServerVersion.Create(new Version(8, 0, 33), ServerType.MySql)));

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IUserService, UserService>();

        services.AddScoped<IAuthService, AuthService>();

        services.AddScoped<ICourseRepository, CourseRepository>();
        services.AddScoped<ICourseService, CourseService>();

        services.AddScoped<ISectionRepository, SectionRepository>();
        services.AddScoped<ISectionService, SectionService>();

        services.AddScoped<IParticipantRepository, ParticipantRepository>();
        services.AddScoped<IParticipantService, ParticipantService>();

        services.AddScoped<IImageRepository, ImageRepository>();
        services.AddScoped<IImageService, ImageService>();
        services.AddScoped<IObjectStorage, MinioObjectStorage>();

        services.AddScoped<IRatingRepository, RatingRepository>();
        services.AddScoped<IRatingService, RatingService>();

        services.AddScoped<ICommentRepository, CommentRepository>();
        services.AddScoped<ICommentService, CommentService>();

        services.Configure<MinioOptions>(config.GetSection("Minio"));

        services.AddMinio(client =>
        {
            var opts = config.GetSection("Minio");
            client
                .WithEndpoint(opts["Endpoint"])
                .WithCredentials(opts["AccessKey"], opts["SecretKey"])
                .WithSSL(bool.Parse(opts["UseSSL"] ?? "false"));
        });

        services.AddSingleton<MinioBucketInitializer>();

        return services;
    }
}