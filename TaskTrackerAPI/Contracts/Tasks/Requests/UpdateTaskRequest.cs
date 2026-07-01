using Domain.Enums;

namespace Contracts.Tasks.Requests;

public record UpdateTaskRequest(
    string? Title,
    string? Description,
    TaskItemStatus? Status,
    TaskItemPriority? Priority,
    int? AssignedToId
);
