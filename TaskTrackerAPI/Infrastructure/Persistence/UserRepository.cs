using Application.Common.Interfaces.Persistence;
using Domain.Models;
using Infrastructure.Common.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class UserRepository(AppDbContext db) : IUserRepository
{
    public async Task<List<User>> GetAllAsync()
        => await db.Users.ToListAsync();

    public async Task<User?> GetByIdAsync(int id)
        => await db.Users.FindAsync(id);

    public async Task<User?> GetByEmailAsync(string email)
        => await db.Users.FirstOrDefaultAsync(u => u.Email == email);

    public async Task<User> AddAsync(User user)
    {
        db.Users.Add(user);
        await db.SaveChangesAsync();
        return user;
    }
}
