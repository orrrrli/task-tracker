using API.Extensions;
using API.Helpers;
using Contracts.Common;
using ErrorOr;

namespace API.Common;

public record ApiSuccessResponse<T>
{
    public bool Success { get; init; } = true;
    public required T Data { get; init; }
}

public record ApiErrorResponse
{
    public bool Success { get; init; } = false;
    public required ApiErrorDetail Error { get; init; }
}

public record ApiErrorDetail
{
    public required string Code { get; init; }
    public required string Message { get; init; }
}

public static class ApiResults
{
    public static IResult Success<T>(T data, string route, object? logData = null)
    {
        LoggingHelper.LogInfo(route, logData);
        return TypedResults.Ok(new ApiSuccessResponse<T> { Data = data });
    }

    public static IResult NoContent(string route)
    {
        LoggingHelper.LogInfo(route, null);
        return TypedResults.NoContent();
    }

    public static IResult Created(string route, int id, string message = "Registro creado exitosamente")
    {
        var data = new CreatedResponse(id, message);
        LoggingHelper.LogInfo(route, data);
        return TypedResults.Created(route, new ApiSuccessResponse<CreatedResponse> { Data = data });
    }

    public static IResult Problem(List<Error> errors, string route)
    {
        LoggingHelper.LogWarning(route, errors);
        return errors.ToProblemResult();
    }

    public static IResult Error(Exception ex, string route, object request)
    {
        LoggingHelper.LogError(route, ex, request);
        return TypedResults.Json(
            new ApiErrorResponse { Error = new ApiErrorDetail { Code = "InternalServerError", Message = ex.InnerException?.Message ?? ex.Message } },
            statusCode: StatusCodes.Status500InternalServerError);
    }
}
