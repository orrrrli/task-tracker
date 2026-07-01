using Application.Common.Interfaces.Persistence;
using Domain.Models;
using Infrastructure.Common.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class TaskRepository(AppDbContext db) : ITaskRepository
{
    public async Task<TaskItem?> GetByIdAsync(int id)
        => await db.Tasks
            .Include(t => t.Creator)
            .Include(t => t.AssignedTo)
            .FirstOrDefaultAsync(t => t.Id == id);

    public async Task<List<TaskItem>> GetAllAsync()
        => await db.Tasks
            .Include(t => t.Creator)
            .Include(t => t.AssignedTo)
            .ToListAsync();

    public async Task<TaskItem> AddAsync(TaskItem task)
    {
        db.Tasks.Add(task);
        await db.SaveChangesAsync();
        return task;
    }

    public async Task<TaskItem> UpdateAsync(TaskItem task)
    {
        db.Tasks.Update(task);
        await db.SaveChangesAsync();
        return task;
    }

    public async Task DeleteAsync(TaskItem task)
    {
        db.Tasks.Remove(task);
        await db.SaveChangesAsync();
    }
}
