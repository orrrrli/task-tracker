namespace Application.UseCases.Commands;

public record DeleteTaskCommand(int Id) : IRequest<ErrorOr<Deleted>>;
