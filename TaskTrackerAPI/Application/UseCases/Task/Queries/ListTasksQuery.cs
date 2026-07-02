using Application.Common.Models;
using Domain.Enums;

namespace Application.UseCases.Task.Queries;

public record ListTasksQuery(
    TaskItemStatus? Status,
    TaskItemPriority? Priority,
    int? AssignedToId,
    string? SortBy,
    bool SortDesc = false
) : IRequest<ErrorOr<List<TaskResult>>>;
