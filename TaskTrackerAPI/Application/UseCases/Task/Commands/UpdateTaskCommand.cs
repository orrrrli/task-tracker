using Application.Common.Models;
using Domain.Enums;

namespace Application.UseCases.Commands;

public record UpdateTaskCommand(
    int Id,
    string? Title,
    string? Description,
    TaskItemStatus? Status,
    TaskItemPriority? Priority,
    int? AssignedToId
) : IRequest<ErrorOr<TaskResult>>;
