using ErrorOr;

namespace API.Helpers;

public static class LoggingHelper
{
    private static ILogger? _logger;

    public static void Initialize(ILoggerFactory factory) =>
        _logger = factory.CreateLogger("API");

    public static void LogRequest(HttpContext ctx, string parameters)
    {
        string method = ctx.Request.Method;
        string route = ctx.Request.Path;
        string ip = ctx.Request.Headers["X-Forwarded-For"].FirstOrDefault()
            ?? ctx.Connection.RemoteIpAddress?.ToString()
            ?? "unknown";
        _logger?.LogInformation("{Method} {Route} | IP: {IP} | Params: {Parameters}", method, route, ip, parameters);
    }

    public static void LogWarning(string route, List<Error> errors) =>
        _logger?.LogWarning("Validation errors at {Route}: {@Errors}", route, errors);

    public static void LogError(string route, Exception ex, object request) =>
        _logger?.LogError(ex, "Error at {Route} with request {@Request}", route, request);
}
