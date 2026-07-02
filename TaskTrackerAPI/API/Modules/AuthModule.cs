using API.Common;
using API.Helpers;
using Application.UseCases.Auth.Commands;
using Application.UseCases.Auth.Queries;
using Carter;
using Contracts.Auth.Requests;
using Contracts.Auth.Responses;
using Contracts.Common;

namespace API.Modules;

public class AuthModule : MainModule, ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        RouteGroupBuilder group = app.MapGroup("auth");

        group.MapPost("/register", RegisterAsync)
            .Produces<ApiSuccessResponse<CreatedResponse>>(StatusCodes.Status201Created)
            .WithName("Register")
            .WithOpenApi();

        group.MapPost("/login", LoginAsync)
            .Produces<ApiSuccessResponse<AuthResponse>>(StatusCodes.Status200OK)
            .WithName("Login")
            .WithOpenApi();
    }

    private static async Task<IResult> RegisterAsync(
        ISender sender,
        HttpContext httpContext,
        RegisterRequest request)
    {
        string fullRoute = httpContext.Request.Path;
        LoggingHelper.LogRequest(httpContext, $"Email: {request.Email}");

        try
        {
            var command = new RegisterCommand(request.Name, request.Email, request.Password);
            var result = await sender.Send(command);

            return result.Match(
                value => ApiResults.Created("/auth/login", value.UserId),
                errors => ApiResults.Problem(errors, fullRoute));
        }
        catch (Exception ex)
        {
            return ApiResults.Error(ex, fullRoute, request);
        }
    }

    private static async Task<IResult> LoginAsync(
        ISender sender,
        IMapper mapper,
        HttpContext httpContext,
        LoginRequest request)
    {
        string fullRoute = httpContext.Request.Path;
        LoggingHelper.LogRequest(httpContext, $"Email: {request.Email}");

        try
        {
            var query = new LoginQuery(request.Email, request.Password);
            var result = await sender.Send(query);

            return result.Match(
                value => ApiResults.Success(mapper.Map<AuthResponse>(value)),
                errors => ApiResults.Problem(errors, fullRoute));
        }
        catch (Exception ex)
        {
            return ApiResults.Error(ex, fullRoute, request);
        }
    }
}
