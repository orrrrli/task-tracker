using Domain.Enums;

namespace Application.UseCases.Task.Common;

public record TaskResult(
    int Id,
    string Title,
    string? Description,
    TaskItemStatus Status,
    TaskItemPriority Priority,
    int CreatorId,
    string CreatorName,
    int? AssignedToId,
    string? AssignedToName,
    DateTime CreatedAt,
    DateTime UpdatedAt
);
