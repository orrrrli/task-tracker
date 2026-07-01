using Application.Common.Models;

namespace Application.UseCases.Queries;

public record GetTaskByIdQuery(int Id) : IRequest<ErrorOr<TaskResult>>;
