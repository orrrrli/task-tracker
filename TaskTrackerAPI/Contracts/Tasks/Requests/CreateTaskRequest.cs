using Domain.Enums;

namespace Contracts.Tasks.Requests;

public record CreateTaskRequest(
    string Title,
    string? Description,
    TaskItemPriority Priority,
    int? AssignedToId,
    int CreatorId
);
