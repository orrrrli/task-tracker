using Application.UseCases.Auth.Common;

namespace Application.UseCases.Auth.Commands;

public record RegisterCommand(
    string Name,
    string Email,
    string Password
) : IRequest<ErrorOr<AuthResult>>;
