using EasyCourse.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace EasyCourse.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<CourseParticipant> CourseParticipant { get; set; }
    public DbSet<Section> Sections { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CourseParticipant>()
            .HasKey(e => new { e.UserId, e.CourseId });

        base.OnModelCreating(modelBuilder);
    }
}