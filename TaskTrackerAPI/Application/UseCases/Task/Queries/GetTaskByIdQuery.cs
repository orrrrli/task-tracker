using Application.UseCases.Task.Common;

namespace Application.UseCases.Task.Queries;

public record GetTaskByIdQuery(int Id) : IRequest<ErrorOr<TaskResult>>;
