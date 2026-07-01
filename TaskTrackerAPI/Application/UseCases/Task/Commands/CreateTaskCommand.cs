using Application.Common.Models;
using Domain.Enums;

namespace Application.UseCases.Commands;

public record CreateTaskCommand(
    string Title,
    string? Description,
    TaskItemPriority Priority,
    int? AssignedToId,
    int CreatorId
) : IRequest<ErrorOr<TaskResult>>;
