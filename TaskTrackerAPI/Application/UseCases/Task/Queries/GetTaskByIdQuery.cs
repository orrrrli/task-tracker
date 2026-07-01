using Application.Common.Models;

namespace Application.UseCases.Task.Queries;

public record GetTaskByIdQuery(int Id) : IRequest<ErrorOr<TaskResult>>;
