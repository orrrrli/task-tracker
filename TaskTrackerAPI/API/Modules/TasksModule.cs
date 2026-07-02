using Carter;

using Microsoft.AspNetCore.Mvc;

using API.Common;
using API.Helpers;
using Application.UseCases.Task.Commands;
using Application.UseCases.Task.Queries;
using Contracts.Common;
using Contracts.Tasks.Requests;
using Contracts.Tasks.Responses;
using Domain.Enums;

namespace API.Modules;

public class TasksModule : MainModule, ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        RouteGroupBuilder group = app.MapGroup("tasks");

        group.MapGet("/", GetAllTasksAsync)
            .Produces<ApiSuccessResponse<List<TaskResponse>>>(StatusCodes.Status200OK)
            .WithName("GetAllTasks")
            .WithOpenApi();

        group.MapGet("/{id:int}", GetTaskByIdAsync)
            .Produces<ApiSuccessResponse<TaskResponse>>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .WithName("GetTaskById")
            .WithOpenApi();

        group.MapPost("/", CreateTaskAsync)
            .Produces<ApiSuccessResponse<CreatedResponse>>(StatusCodes.Status201Created)
            .WithName("CreateTask")
            .WithOpenApi();

        group.MapPatch("/{id:int}", UpdateTaskAsync)
            .Produces<ApiSuccessResponse<TaskResponse>>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .WithName("UpdateTask")
            .WithOpenApi();

        group.MapDelete("/{id:int}", DeleteTaskAsync)
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound)
            .WithName("DeleteTask")
            .WithOpenApi();
    }

    private static async Task<IResult> GetAllTasksAsync(
        ISender sender,
        IMapper mapper,
        HttpContext httpContext,
        [FromQuery] TaskItemStatus? status,
        [FromQuery] TaskItemPriority? priority,
        [FromQuery] int? assignedToId,
        [FromQuery] int? creatorId,
        [FromQuery] string? sortBy,
        [FromQuery] bool sortDesc = false)
    {
        string fullRoute = httpContext.Request.Path;
        string parametros = $"Status: {status}, Priority: {priority}, AssignedToId: {assignedToId}, CreatorId: {creatorId}, SortBy: {sortBy}, SortDesc: {sortDesc}";
        LoggingHelper.LogRequest(httpContext, parametros);

        try
        {
            var query = new ListTasksQuery(status, priority, assignedToId, sortBy, sortDesc, creatorId);
            var result = await sender.Send(query);

            return result.Match(
                value => ApiResults.Success(mapper.Map<List<TaskResponse>>(value)),
                errors => ApiResults.Problem(errors, fullRoute));
        }
        catch (Exception ex)
        {
            return ApiResults.Error(ex, fullRoute, parametros);
        }
    }

    private static async Task<IResult> GetTaskByIdAsync(
        ISender sender,
        IMapper mapper,
        HttpContext httpContext,
        [FromRoute] int id)
    {
        string fullRoute = httpContext.Request.Path;
        string parametros = $"Id: {id}";
        LoggingHelper.LogRequest(httpContext, parametros);

        try
        {
            var result = await sender.Send(new GetTaskByIdQuery(id));

            return result.Match(
                value => ApiResults.Success(mapper.Map<TaskResponse>(value)),
                errors => ApiResults.Problem(errors, fullRoute));
        }
        catch (Exception ex)
        {
            return ApiResults.Error(ex, fullRoute, parametros);
        }
    }

    private static async Task<IResult> CreateTaskAsync(
        ISender sender,
        HttpContext httpContext,
        [FromBody] CreateTaskRequest request)
    {
        string fullRoute = httpContext.Request.Path;
        string parametros = $"Title: {request.Title}, Priority: {request.Priority}, CreatorId: {request.CreatorId}";
        LoggingHelper.LogRequest(httpContext, parametros);

        try
        {
            var command = new CreateTaskCommand(request.Title, request.Description, request.Priority, request.AssignedToId, request.CreatorId);
            var result = await sender.Send(command);

            return result.Match(
                value => ApiResults.Created($"/tasks/{value.Id}", value.Id),
                errors => ApiResults.Problem(errors, fullRoute));
        }
        catch (Exception ex)
        {
            return ApiResults.Error(ex, fullRoute, parametros);
        }
    }

    private static async Task<IResult> UpdateTaskAsync(
        ISender sender,
        IMapper mapper,
        HttpContext httpContext,
        [FromRoute] int id,
        [FromBody] UpdateTaskRequest request)
    {
        string fullRoute = httpContext.Request.Path;
        string parametros = $"Id: {id}";
        LoggingHelper.LogRequest(httpContext, parametros);

        try
        {
            var command = new UpdateTaskCommand(id, request.Title, request.Description, request.Status, request.Priority, request.AssignedToId);
            var result = await sender.Send(command);

            return result.Match(
                value => ApiResults.Success(mapper.Map<TaskResponse>(value)),
                errors => ApiResults.Problem(errors, fullRoute));
        }
        catch (Exception ex)
        {
            return ApiResults.Error(ex, fullRoute, parametros);
        }
    }

    private static async Task<IResult> DeleteTaskAsync(
        ISender sender,
        HttpContext httpContext,
        [FromRoute] int id)
    {
        string fullRoute = httpContext.Request.Path;
        string parametros = $"Id: {id}";
        LoggingHelper.LogRequest(httpContext, parametros);

        try
        {
            var command = new DeleteTaskCommand(id);
            var result = await sender.Send(command);

            return result.Match(
                _ => ApiResults.NoContent(),
                errors => ApiResults.Problem(errors, fullRoute));
        }
        catch (Exception ex)
        {
            return ApiResults.Error(ex, fullRoute, parametros);
        }
    }
}
