using Carter;

using API.Common;
using API.Helpers;
using Application.Common.Models;
using Application.UseCases.User.Queries;

namespace API.Modules;

public class UsersModule : MainModule, ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        RouteGroupBuilder group = app.MapGroup("users");

        group.MapGet("/", GetAllUsersAsync)
            .Produces<ApiSuccessResponse<List<UserResult>>>(StatusCodes.Status200OK)
            .WithName("GetAllUsers")
            .WithOpenApi();
    }

    private static async Task<IResult> GetAllUsersAsync(
        ISender sender,
        HttpContext httpContext)
    {
        string fullRoute = httpContext.Request.Path;
        LoggingHelper.LogRequest(httpContext, string.Empty);

        try
        {
            var result = await sender.Send(new ListUsersQuery());

            return result.Match(
                value => ApiResults.Success(value),
                errors => ApiResults.Problem(errors, fullRoute));
        }
        catch (Exception ex)
        {
            return ApiResults.Error(ex, fullRoute, string.Empty);
        }
    }
}
