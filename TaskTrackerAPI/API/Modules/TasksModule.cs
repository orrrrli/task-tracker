using Carter;

using Microsoft.AspNetCore.Mvc;

using API.Common;
using API.Helpers;
using Application.Common.Models;
using Application.UseCases.Task.Commands;
using Application.UseCases.Task.Queries;
using Domain.Enums;

namespace API.Modules;

public class TasksModule : MainModule, ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        RouteGroupBuilder group = app.MapGroup("tasks");

        group.MapGet("/", GetAllTasksAsync)
            .Produces<ApiSuccessResponse<TaskListResult>>(StatusCodes.Status200OK)
            .WithName("GetAllTasks")
            .WithOpenApi();

        group.MapGet("/{id:int}", GetTaskByIdAsync)
            .Produces<ApiSuccessResponse<TaskResult>>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .WithName("GetTaskById")
            .WithOpenApi();

        group.MapGet("/create", CreateTaskAsync)
            .Produces<ApiSuccessResponse<TaskResult>>(StatusCodes.Status201Created)
            .WithName("CreateTask")
            .WithOpenApi();

        group.MapGet("/{id:int}/update", UpdateTaskAsync)
            .Produces<ApiSuccessResponse<TaskResult>>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .WithName("UpdateTask")
            .WithOpenApi();

        group.MapGet("/{id:int}/delete", DeleteTaskAsync)
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound)
            .WithName("DeleteTask")
            .WithOpenApi();
    }

    private static async Task<IResult> GetAllTasksAsync(
        ISender sender,
        HttpContext httpContext,
        [FromQuery] TaskItemStatus? status,
        [FromQuery] TaskItemPriority? priority,
        [FromQuery] int? assignedToId,
        [FromQuery] string? sortBy,
        [FromQuery] bool sortDesc = false,
        [FromQuery] int page = 1,
        [FromQuery] int size = 7)
    {
        string fullRoute = httpContext.Request.Path;
        string parametros = $"Status: {status}, Priority: {priority}, AssignedToId: {assignedToId}, SortBy: {sortBy}, SortDesc: {sortDesc}, Page: {page}, Size: {size}";
        LoggingHelper.LogRequest(fullRoute, parametros);

        try
        {
            var query = new ListTasksQuery(status, priority, assignedToId, sortBy, sortDesc, page, size);
            var result = await sender.Send(query);

            return result.Match(
                value => ApiResults.Success(value, fullRoute),
                errors => ApiResults.Problem(errors, fullRoute));
        }
        catch (Exception ex)
        {
            return ApiResults.Error(ex, fullRoute, parametros);
        }
    }

    private static async Task<IResult> GetTaskByIdAsync(
        ISender sender,
        HttpContext httpContext,
        [FromRoute] int id)
    {
        string fullRoute = httpContext.Request.Path;
        string parametros = $"Id: {id}";
        LoggingHelper.LogRequest(fullRoute, parametros);

        try
        {
            var result = await sender.Send(new GetTaskByIdQuery(id));

            return result.Match(
                value => ApiResults.Success(value, fullRoute),
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
        [FromQuery] string title,
        [FromQuery] TaskItemPriority priority,
        [FromQuery] int creatorId,
        [FromQuery] string? description,
        [FromQuery] int? assignedToId)
    {
        string fullRoute = httpContext.Request.Path;
        string parametros = $"Title: {title}, Priority: {priority}, CreatorId: {creatorId}";
        LoggingHelper.LogRequest(fullRoute, parametros);

        try
        {
            var command = new CreateTaskCommand(title, description, priority, assignedToId, creatorId);
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
        HttpContext httpContext,
        [FromRoute] int id,
        [FromQuery] string? title,
        [FromQuery] string? description,
        [FromQuery] TaskItemStatus? status,
        [FromQuery] TaskItemPriority? priority,
        [FromQuery] int? assignedToId)
    {
        string fullRoute = httpContext.Request.Path;
        string parametros = $"Id: {id}";
        LoggingHelper.LogRequest(fullRoute, parametros);

        try
        {
            var command = new UpdateTaskCommand(id, title, description, status, priority, assignedToId);
            var result = await sender.Send(command);

            return result.Match(
                value => ApiResults.Success(value, fullRoute),
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
        LoggingHelper.LogRequest(fullRoute, parametros);

        try
        {
            var command = new DeleteTaskCommand(id);
            var result = await sender.Send(command);

            return result.Match(
                _ => ApiResults.NoContent(fullRoute),
                errors => ApiResults.Problem(errors, fullRoute));
        }
        catch (Exception ex)
        {
            return ApiResults.Error(ex, fullRoute, parametros);
        }
    }
}
