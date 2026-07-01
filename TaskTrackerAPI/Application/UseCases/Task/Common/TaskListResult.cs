namespace Application.Common.Models;

public record TaskListResult(
    IEnumerable<TaskResult> Items,
    int Page,
    int Size,
    int Total
);
