using EasyCourse.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace EasyCourse.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<CourseParticipant> CourseParticipant { get; set; }
    public DbSet<Section> Sections { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<Image> Images { get; set; }
    public DbSet<Rating> Ratings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CourseParticipant>()
            .HasKey(e => new { e.UserId, e.CourseId });

        modelBuilder.Entity<Section>()
            .HasOne(s => s.Course)
            .WithMany(s => s.Sections)
            .HasForeignKey(s => s.CourseId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Rating>()
            .HasKey(r => r.Id);

        modelBuilder.Entity<Rating>()
            .HasIndex(r => new { r.UserId, r.EntityId })
            .IsUnique();

        base.OnModelCreating(modelBuilder);
    }
}