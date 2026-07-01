namespace Contracts.Tasks.Responses;

public record TaskListResponse(
    IEnumerable<TaskResponse> Items,
    int Page,
    int Size,
    int Total
);
