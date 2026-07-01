using Application.Common.Interfaces.Persistence;
using Application.UseCases.Commands;

namespace Application.UseCases.Handlers;

public class DeleteTaskCommandHandler(ITaskRepository taskRepository)
    : IRequestHandler<DeleteTaskCommand, ErrorOr<Deleted>>
{
    public async Task<ErrorOr<Deleted>> Handle(DeleteTaskCommand command, CancellationToken cancellationToken)
    {
        var task = await taskRepository.GetByIdAsync(command.Id);

        if (task is null)
            return Error.NotFound("Task.NotFound", $"Task with id {command.Id} was not found.");

        await taskRepository.DeleteAsync(task);
        return Result.Deleted;
    }
}
