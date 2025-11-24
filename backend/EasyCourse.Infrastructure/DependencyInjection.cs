using EasyCourse.Core.Interfaces.Repository;
using EasyCourse.Core.Interfaces.Service;
using EasyCourse.Infrastructure.Data;
using EasyCourse.Infrastructure.Repositories;
using EasyCourse.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;

namespace EasyCourse.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        services.AddSingleton<IJwtService, JwtService>();

        services.AddDbContext<AppDbContext>(options =>
            options.UseMySql(config.GetConnectionString("DefaultConnection"), ServerVersion.Create(new Version(8, 0, 27), ServerType.MySql)));

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IUserService, UserService>();

        services.AddScoped<IAuthService, AuthService>();

        services.AddScoped<ICourseRepository, CourseRepository>();
        services.AddScoped<ICourseService, CourseService>();

        services.AddScoped<ISectionRepository, SectionRepository>();
        services.AddScoped<ISectionService, SectionService>();

        services.AddScoped<IParticipantRepository, ParticipantRepository>();
        services.AddScoped<IParticipantService, ParticipantService>();

        return services;
    }
}