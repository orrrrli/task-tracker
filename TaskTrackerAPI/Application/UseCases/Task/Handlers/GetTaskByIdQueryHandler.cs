using Application.Common.Interfaces.Persistence;
using Application.Common.Models;
using Application.UseCases.Queries;

namespace Application.UseCases.Handlers;

public class GetTaskByIdQueryHandler(ITaskRepository taskRepository, IMapper mapper)
    : IRequestHandler<GetTaskByIdQuery, ErrorOr<TaskResult>>
{
    public async Task<ErrorOr<TaskResult>> Handle(GetTaskByIdQuery query, CancellationToken cancellationToken)
    {
        var task = await taskRepository.GetByIdAsync(query.Id);

        if (task is null)
            return Error.NotFound("Task.NotFound", $"Task with id {query.Id} was not found.");

        return mapper.Map<TaskResult>(task);
    }
}
