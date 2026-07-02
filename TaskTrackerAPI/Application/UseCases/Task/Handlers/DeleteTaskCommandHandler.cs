using Application.Common.Errors;
using Application.Common.Interfaces.Persistence;
using Application.UseCases.Task.Commands;

namespace Application.UseCases.Task.Handlers;

public class DeleteTaskCommandHandler(ITaskRepository taskRepository)
    : IRequestHandler<DeleteTaskCommand, ErrorOr<Deleted>>
{
    public async Task<ErrorOr<Deleted>> Handle(DeleteTaskCommand command, CancellationToken cancellationToken)
    {
        var task = await taskRepository.GetByIdAsync(command.Id);

        if (task is null)
            return TaskErrors.NotFound(command.Id);

        if (task.Status == Domain.Enums.TaskItemStatus.Done)
            return TaskErrors.AlreadyCompleted(command.Id);

        if (task.Status == Domain.Enums.TaskItemStatus.Cancelled)
            return TaskErrors.AlreadyCancelled(command.Id);

        await taskRepository.DeleteAsync(task);
        return Result.Deleted;
    }
}
