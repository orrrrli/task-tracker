using Application.Common.Interfaces.Persistence;
using Application.Common.Models;
using Application.UseCases.Task.Queries;

namespace Application.UseCases.Task.Handlers;

public class ListTasksQueryHandler(ITaskRepository taskRepository, IMapper mapper)
    : IRequestHandler<ListTasksQuery, ErrorOr<List<TaskResult>>>
{
    public async Task<ErrorOr<List<TaskResult>>> Handle(ListTasksQuery query, CancellationToken cancellationToken)
    {
        var tasks = await taskRepository.GetAllAsync();

        var filtered = tasks
            .Where(t => query.Status == null || t.Status == query.Status)
            .Where(t => query.Priority == null || t.Priority == query.Priority)
            .Where(t => query.AssignedToId == null || t.AssignedToId == query.AssignedToId);

        var sorted = query.SortBy?.ToLower() switch
        {
            "title"     => query.SortDesc ? filtered.OrderByDescending(t => t.Title)     : filtered.OrderBy(t => t.Title),
            "priority"  => query.SortDesc ? filtered.OrderByDescending(t => t.Priority)  : filtered.OrderBy(t => t.Priority),
            "createdat" => query.SortDesc ? filtered.OrderByDescending(t => t.CreatedAt) : filtered.OrderBy(t => t.CreatedAt),
            _           => filtered.OrderByDescending(t => t.CreatedAt)
        };

        return sorted
            .Select(t => mapper.Map<TaskResult>(t))
            .ToList();
    }
}
