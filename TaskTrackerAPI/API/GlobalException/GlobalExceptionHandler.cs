using System.Text.Json;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace API.GlobalException;

public class GlobalExceptionHandler(
    ILogger<GlobalExceptionHandler> logger,
    IHostEnvironment environment) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        logger.LogError(
            exception,
            "Unhandled exception at {RequestPath}. TraceId: {TraceId}",
            httpContext.Request.Path,
            httpContext.TraceIdentifier);

        (int statusCode, string title, string detail) = GetExceptionDetails(exception);

        var problemDetails = new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            Detail = detail,
            Instance = httpContext.Request.Path,
        };

        if (environment.IsDevelopment())
        {
            problemDetails.Extensions["traceId"] = httpContext.TraceIdentifier;
            problemDetails.Extensions["exception"] = new
            {
                exception.Message,
                exception.StackTrace,
                InnerException = exception.InnerException?.Message
            };
        }

        httpContext.Response.StatusCode = statusCode;
        httpContext.Response.ContentType = "application/problem+json";

        await httpContext.Response.WriteAsJsonAsync(
            problemDetails,
            new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase },
            cancellationToken);

        return true;
    }

    private static (int StatusCode, string Title, string Detail) GetExceptionDetails(Exception exception) =>
        exception switch
        {
            TimeoutException => (
                StatusCodes.Status504GatewayTimeout,
                "Gateway Timeout",
                "The operation could not complete in the expected time. Please try again."),
            _ => (
                StatusCodes.Status500InternalServerError,
                "Internal Server Error",
                "An unexpected error occurred. Please try again.")
        };
}
