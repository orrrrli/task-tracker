using System.Text.Json.Serialization;
using System.Threading.RateLimiting;
using API.Extensions;
using API.GlobalException;
using Carter;
using Microsoft.AspNetCore.RateLimiting;

namespace API;

public static class DependencyInjection
{
    public static IServiceCollection AddPresentation(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddCustomCors(configuration)
            .AddOpenApi()
            .AddCarter()
            .AddGlobalExceptionHandling()
            .AddProblemDetails()
            .AddMapping()
            .AddRateLimitingConfig();

        services.AddHealthChecks();

        services.ConfigureHttpJsonOptions(options =>
            options.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));

        return services;
    }

    private static IServiceCollection AddCustomCors(this IServiceCollection services, IConfiguration configuration)
    {
        string[]? allowedOrigins = configuration.GetSection("CorsSettings:AllowedOrigins").Get<string[]>();

        services.AddCors(options => options.AddPolicy("DefaultPolicy", builder =>
        {
            if (allowedOrigins is { Length: > 0 })
                builder.WithOrigins(allowedOrigins).AllowAnyMethod().AllowAnyHeader();
            else
                builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
        }));

        return services;
    }

    private static IServiceCollection AddGlobalExceptionHandling(this IServiceCollection services)
    {
        services.AddExceptionHandler<GlobalExceptionHandler>();
        return services;
    }

    private static IServiceCollection AddRateLimitingConfig(this IServiceCollection services)
    {
        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

            options.AddPolicy("api", httpContext =>
            {
                string ip = httpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault()
                    ?? httpContext.Connection.RemoteIpAddress?.ToString()
                    ?? "unknown";

                return RateLimitPartition.GetFixedWindowLimiter(ip, _ => new FixedWindowRateLimiterOptions
                {
                    Window = TimeSpan.FromMinutes(1),
                    PermitLimit = 60,
                    QueueLimit = 0,
                    AutoReplenishment = true,
                });
            });
        });

        return services;
    }
}
