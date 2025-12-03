using EasyCourse.Core.DTO.Auth;
using EasyCourse.Core.Entities;
using EasyCourse.Core.Interfaces.Repository;
using EasyCourse.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EasyCourse.Infrastructure.Repositories;

public class UserRepository(AppDbContext _context) : IUserRepository
{
    private readonly PasswordHasher<User> _passwordHasher = new();

    public async Task<User> CreateUser(AuthRequest user)
    {
        if (await UserExists(user.Email))
            throw new InvalidOperationException("User with this email already exists.");

        var entity = new User
        {
            Id = Guid.NewGuid(),
            Username = user.Username,
            Email = user.Email,
        };

        entity.PasswordHash = _passwordHasher.HashPassword(entity, user.Password);

        _context.Users.Add(entity);
        await _context.SaveChangesAsync();

        return entity;
    }

    public async Task<bool> DeleteUserById(Guid id)
    {
        var user = await _context.Users.FindAsync(id) ?? throw new KeyNotFoundException("User not found.");

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<User?> GetUserByEmail(string email)
    {
        return await _context.Users.Include(u => u.ProfilePicture).FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User?> GetUserById(Guid id)
    {
        return await _context.Users.Include(u=> u.ProfilePicture).FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<User> UpdateUser(User user)
    {
        var dbUser = await _context.Users
            .Include(u => u.ProfilePicture)
            .FirstOrDefaultAsync(u => u.Id == user.Id);

        if (dbUser == null)
            throw new KeyNotFoundException("User not found.");

        if (user.Username != "")
            dbUser.Username = user.Username;

        if (user.Email != "")
            dbUser.Email = user.Email;
        
        if (user.ProfilePictureId != null)
            dbUser.ProfilePictureId = user.ProfilePictureId;

        await _context.SaveChangesAsync();

        return dbUser;
    }

    public async Task<bool> UserExists(string? email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return false;

        return await _context.Users.AnyAsync(u => u.Email == email);
    }
}