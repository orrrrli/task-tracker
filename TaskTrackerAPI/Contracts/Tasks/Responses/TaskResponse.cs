using Domain.Enums;

namespace Contracts.Tasks.Responses;

public record TaskResponse(
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
