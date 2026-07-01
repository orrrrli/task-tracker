using API.Common;
using API.Helpers;
using Application.UseCases.Commands;
using Application.UseCases.Queries;
using Carter;
using Domain.Enums;
using ErrorOr;

namespace API.Modules;

public class TasksModule : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder routes)
    {
        routes.MapGet("/tasks", async (
            ISender sender,
            TaskItemStatus? status,
            TaskItemPriority? priority,
            int? assignedToId,
            string? sortBy,
            bool sortDesc = false,
            int page = 1,
            int size = 7) =>
        {
            var query = new ListTasksQuery(status, priority, assignedToId, sortBy, sortDesc, page, size);
            var result = await sender.Send(query);
            var route = $"/tasks?status={status}&priority={priority}&assignedToId={assignedToId}&sortBy={sortBy}&sortDesc={sortDesc}&page={page}&size={size}";

            return result.Match(
                data => ApiResults.Success(data, route),
                errors => ApiResults.Problem(errors, route));
        });

        routes.MapGet("/tasks/{id:int}", async (ISender sender, int id) =>
        {
            var query = new GetTaskByIdQuery(id);
            var result = await sender.Send(query);
            var route = $"/tasks/{id}";

            return result.Match(
                data => ApiResults.Success(data, route),
                errors => ApiResults.Problem(errors, route));
        });

        routes.MapGet("/tasks/create", async (
            ISender sender,
            string title,
            string? description,
            TaskItemPriority priority,
            int? assignedToId,
            int creatorId) =>
        {
            var command = new CreateTaskCommand(title, description, priority, assignedToId, creatorId);
            var result = await sender.Send(command);

            return result.Match(
                data => ApiResults.Created($"/tasks/{data.Id}", data.Id),
                errors => ApiResults.Problem(errors, "/tasks/create"));
        });

        routes.MapGet("/tasks/{id:int}/update", async (
            ISender sender,
            int id,
            string? title,
            string? description,
            TaskItemStatus? status,
            TaskItemPriority? priority,
            int? assignedToId) =>
        {
            var command = new UpdateTaskCommand(id, title, description, status, priority, assignedToId);
            var result = await sender.Send(command);
            var route = $"/tasks/{id}/update";

            return result.Match(
                data => ApiResults.Success(data, route),
                errors => ApiResults.Problem(errors, route));
        });

        routes.MapGet("/tasks/{id:int}/delete", async (ISender sender, int id) =>
        {
            var command = new DeleteTaskCommand(id);
            var result = await sender.Send(command);
            var route = $"/tasks/{id}/delete";

            return result.Match(
                _ => { LoggingHelper.LogInfo(route, null); return TypedResults.NoContent(); },
                errors => ApiResults.Problem(errors, route));
        });
    }
}
