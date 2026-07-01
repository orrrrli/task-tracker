using Application.Common.Interfaces.Persistence;
using Application.Common.Models;
using Application.UseCases.Commands;
using Domain.Models;

namespace Application.UseCases.Handlers;

public class CreateTaskCommandHandler(ITaskRepository taskRepository, IMapper mapper)
    : IRequestHandler<CreateTaskCommand, ErrorOr<TaskResult>>
{
    public async Task<ErrorOr<TaskResult>> Handle(CreateTaskCommand command, CancellationToken cancellationToken)
    {
        var task = new TaskItem
        {
            Title = command.Title,
            Description = command.Description,
            Priority = command.Priority,
            AssignedToId = command.AssignedToId,
            CreatorId = command.CreatorId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var created = await taskRepository.AddAsync(task);
        var full = await taskRepository.GetByIdAsync(created.Id);

        return mapper.Map<TaskResult>(full!);
    }
}
