namespace Application.Common.Models;

public record PagedResult<T>(
    IEnumerable<T> Items,
    int Page,
    int Size,
    int Total
);
