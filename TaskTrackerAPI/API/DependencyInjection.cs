using System.Text;
using System.Text.Json.Serialization;
using System.Threading.RateLimiting;
using API.Extensions;
using API.GlobalException;
using API.Helpers;
using Carter;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;

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
            .AddForwardedHeadersConfig(configuration)
            .AddRateLimitingConfig();

        services.AddHealthChecks();

        services.AddJwtAuthentication(configuration);

        services.ConfigureHttpJsonOptions(options =>
            options.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));

        return services;
    }

    private static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        IConfigurationSection jwtSettings = configuration.GetSection("JwtSettings");

        // Production gets it from JwtSettings__Secret (CI writes JWT_SECRET into the server .env).
        // Refuse to start without it rather than sign tokens with an empty or weak key.
        string? secret = jwtSettings["Secret"];
        if (string.IsNullOrWhiteSpace(secret) || Encoding.UTF8.GetByteCount(secret) < 32)
            throw new InvalidOperationException("JwtSettings:Secret must be set to at least 32 bytes.");

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidAudience = jwtSettings["Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(secret))
                };
            });

        services.AddAuthorization();

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

    /// <summary>
    /// Production path: Cloudflare → host nginx ($proxy_add_x_forwarded_for) → API container.
    /// Trusts only ForwardedHeaders:KnownNetworks (loopback, private/Docker ranges, Cloudflare's
    /// published ranges). The middleware walks X-Forwarded-For from the right while hops are
    /// trusted, so the client IP is the right-most untrusted entry and anything a client
    /// prepends is ignored.
    /// </summary>
    public static IServiceCollection AddForwardedHeadersConfig(this IServiceCollection services, IConfiguration configuration)
    {
        string[] networks = configuration.GetSection("ForwardedHeaders:KnownNetworks").Get<string[]>() ?? [];

        services.Configure<ForwardedHeadersOptions>(options =>
        {
            options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
            options.ForwardLimit = null;
            options.KnownProxies.Clear();
            options.KnownNetworks.Clear();
            foreach (string cidr in networks)
                options.KnownNetworks.Add(Microsoft.AspNetCore.HttpOverrides.IPNetwork.Parse(cidr));
        });

        return services;
    }

    private static IServiceCollection AddRateLimitingConfig(this IServiceCollection services)
    {
        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

            // Runs after UseForwardedHeaders, so the connection IP is already the client.
            options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
            {
                string ip = ClientIp.RateLimitKey(httpContext.Connection.RemoteIpAddress);

                return RateLimitPartition.GetFixedWindowLimiter(ip, _ => new FixedWindowRateLimiterOptions
                {
                    Window = TimeSpan.FromMinutes(10),
                    PermitLimit = 10,
                    QueueLimit = 0,
                    AutoReplenishment = true,
                });
            });
        });

        return services;
    }
}
