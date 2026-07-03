using Application.Common.Errors;
using Application.Common.Interfaces.Persistence;
using Application.Common.Models;
using Application.UseCases.Task.Common;
using Application.UseCases.Task.Queries;

namespace Application.UseCases.Task.Handlers;

public class GetTaskByIdQueryHandler(ITaskRepository taskRepository, IMapper mapper)
    : IRequestHandler<GetTaskByIdQuery, ErrorOr<TaskResult>>
{
    public async Task<ErrorOr<TaskResult>> Handle(GetTaskByIdQuery query, CancellationToken cancellationToken)
    {
        var task = await taskRepository.GetByIdAsync(query.Id);

        if (task is null)
            return TaskErrors.NotFound(query.Id);

        return mapper.Map<TaskResult>(task);
    }
}
