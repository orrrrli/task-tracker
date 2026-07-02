using ErrorOr;

namespace API.Helpers;

public static class LoggingHelper
{
    private static ILogger? _logger;

    public static void Initialize(ILoggerFactory factory) =>
        _logger = factory.CreateLogger("API");

    public static void LogRequest(string route, string parameters) =>
        _logger?.LogInformation("Incoming request at {Route} | Params: {Parameters}", route, parameters);

    public static void LogInfo(string route, object? data)
    {
        if (data is null)
            _logger?.LogInformation("Response sent at {Route}", route);
        else
            _logger?.LogInformation("Response sent at {Route}: {@Data}", route, data);
    }

    public static void LogWarning(string route, List<Error> errors) =>
        _logger?.LogWarning("Validation errors at {Route}: {@Errors}", route, errors);

    public static void LogError(string route, Exception ex, object request) =>
        _logger?.LogError(ex, "Error at {Route} with request {@Request}", route, request);
}
