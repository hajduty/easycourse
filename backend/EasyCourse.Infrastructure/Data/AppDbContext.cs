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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CourseParticipant>()
            .HasKey(e => new { e.UserId, e.CourseId });

        modelBuilder.Entity<RefreshToken>()
            .Property(r => r.Id)
            .HasDefaultValueSql("NEWID()")
            .ValueGeneratedOnAdd();

        modelBuilder.Entity<Section>()
            .HasOne(s => s.Course)
            .WithMany(s => s.Sections)
            .HasForeignKey(s => s.CourseId)
            .OnDelete(DeleteBehavior.Cascade);

        base.OnModelCreating(modelBuilder);
    }
}