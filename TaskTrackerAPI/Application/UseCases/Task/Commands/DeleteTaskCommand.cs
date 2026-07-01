namespace Application.UseCases.Task.Commands;

public record DeleteTaskCommand(int Id) : IRequest<ErrorOr<Deleted>>;
