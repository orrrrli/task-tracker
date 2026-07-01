using ErrorOr;

namespace API.Helpers;

public static class LoggingHelper
{
    private static ILogger? _logger;

    public static void Initialize(ILoggerFactory factory) =>
        _logger = factory.CreateLogger("API");

    public static void LogInfo(string route, object? data) =>
        _logger?.LogInformation("Request at {Route}: {@Data}", route, data);

    public static void LogWarning(string route, List<Error> errors) =>
        _logger?.LogWarning("Validation errors at {Route}: {@Errors}", route, errors);

    public static void LogError(string route, Exception ex, object request) =>
        _logger?.LogError(ex, "Error at {Route} with request {@Request}", route, request);
}
