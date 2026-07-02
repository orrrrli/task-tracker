using Application.UseCases.Auth.Common;

namespace Application.UseCases.Auth.Queries;

public record LoginQuery(
    string Email,
    string Password
) : IRequest<ErrorOr<AuthResult>>;
