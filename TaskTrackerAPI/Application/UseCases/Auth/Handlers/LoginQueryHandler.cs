using Application.Common.Errors;
using Application.Common.Interfaces.Persistence;
using Application.Common.Interfaces.Security;
using Application.UseCases.Auth.Common;
using Application.UseCases.Auth.Queries;

namespace Application.UseCases.Auth.Handlers;

public class LoginQueryHandler(
    IUserRepository userRepository,
    IPasswordHasher passwordHasher,
    IJwtTokenGenerator jwtTokenGenerator)
    : IRequestHandler<LoginQuery, ErrorOr<AuthResult>>
{
    public async Task<ErrorOr<AuthResult>> Handle(LoginQuery query, CancellationToken ct)
    {
        var user = await userRepository.GetByEmailAsync(query.Email);
        if (user is null || !passwordHasher.Verify(query.Password, user.PasswordHash))
            return AuthErrors.InvalidCredentials;

        var token = jwtTokenGenerator.GenerateToken(user);
        return new AuthResult(token, user.Id, user.Name, user.Email);
    }
}
