using Domain.Enums;

namespace Contracts.Tasks.Requests;

public record TaskListRequest(
    TaskItemStatus? Status,
    TaskItemPriority? Priority,
    int? AssignedToId,
    string? SortBy,
    bool SortDesc = false,
    int Page = 1,
    int Size = 7
);
