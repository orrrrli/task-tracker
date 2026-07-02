namespace Application.Common.Errors;

public static class TaskErrors
{
    public static Error NotFound(int id) => Error.NotFound(
        code: "Task.NotFound",
        description: $"La tarea con id {id} no fue encontrada.");

    public static Error AlreadyCompleted(int id) => Error.Conflict(
        code: "Task.AlreadyCompleted",
        description: $"La tarea con id {id} ya está completada y no puede modificarse.");

    public static Error AlreadyCancelled(int id) => Error.Conflict(
        code: "Task.AlreadyCancelled",
        description: $"La tarea con id {id} ya está cancelada y no puede modificarse.");
}
