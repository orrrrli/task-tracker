using Application.Common.Models;
using Domain.Enums;

namespace Application.UseCases.Queries;

public record ListTasksQuery(
    TaskItemStatus? Status,
    TaskItemPriority? Priority,
    int? AssignedToId,
    string? SortBy,
    bool SortDesc = false,
    int Page = 1,
    int Size = 7
) : IRequest<ErrorOr<TaskListResult>>;
