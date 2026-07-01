using Application.Common.Interfaces.Persistence;
using Application.Common.Models;
using Application.UseCases.Commands;

namespace Application.UseCases.Handlers;

public class UpdateTaskCommandHandler(ITaskRepository taskRepository, IMapper mapper)
    : IRequestHandler<UpdateTaskCommand, ErrorOr<TaskResult>>
{
    public async Task<ErrorOr<TaskResult>> Handle(UpdateTaskCommand command, CancellationToken cancellationToken)
    {
        var task = await taskRepository.GetByIdAsync(command.Id);

        if (task is null)
            return Error.NotFound("Task.NotFound", $"Task with id {command.Id} was not found.");

        if (command.Title is not null) task.Title = command.Title;
        if (command.Description is not null) task.Description = command.Description;
        if (command.Status is not null) task.Status = command.Status.Value;
        if (command.Priority is not null) task.Priority = command.Priority.Value;
        if (command.AssignedToId is not null) task.AssignedToId = command.AssignedToId;

        task.UpdatedAt = DateTime.UtcNow;

        await taskRepository.UpdateAsync(task);
        return mapper.Map<TaskResult>(task);
    }
}
