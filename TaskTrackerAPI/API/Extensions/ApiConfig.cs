using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Serilog;

namespace API.Extensions;

public static class ApiConfig
{
    public static WebApplication UseHttpRequestLogging(this WebApplication app)
    {
        app.UseSerilogRequestLogging(options =>
        {
            options.MessageTemplate = "HTTP {RequestMethod} {RequestPath} | {StatusCode} | {Elapsed:0}ms | IP: {IP}";
            options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
            {
                string ip = httpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault()
                    ?? httpContext.Connection.RemoteIpAddress?.ToString()
                    ?? "unknown";
                diagnosticContext.Set("IP", ip);
            };
        });
        return app;
    }

    public static WebApplication UseSecurityHeaders(this WebApplication app)
    {
        app.Use(async (context, next) =>
        {
            context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
            context.Response.Headers.Append("X-Frame-Options", "DENY");
            context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
            context.Response.Headers.Append("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
            await next();
        });

        return app;
    }

    public static WebApplication MapHealthCheck(this WebApplication app)
    {
        app.MapHealthChecks("/health", new HealthCheckOptions
        {
            ResponseWriter = async (context, report) =>
            {
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsJsonAsync(new { status = report.Status.ToString() });
            }
        }).AllowAnonymous();

        return app;
    }
}
