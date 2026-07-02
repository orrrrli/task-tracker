using Application.Common.Errors;
using Application.Common.Interfaces.Persistence;
using Application.Common.Interfaces.Security;
using Application.UseCases.Auth.Commands;
using Application.UseCases.Auth.Common;

namespace Application.UseCases.Auth.Handlers;

public class RegisterCommandHandler(
    IUserRepository userRepository,
    IPasswordHasher passwordHasher,
    IJwtTokenGenerator jwtTokenGenerator)
    : IRequestHandler<RegisterCommand, ErrorOr<AuthResult>>
{
    public async Task<ErrorOr<AuthResult>> Handle(RegisterCommand command, CancellationToken ct)
    {
        if (await userRepository.GetByEmailAsync(command.Email) is not null)
            return AuthErrors.EmailAlreadyExists;

        var user = new Domain.Models.User
        {
            Name = command.Name,
            Email = command.Email,
            PasswordHash = passwordHasher.Hash(command.Password),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var created = await userRepository.AddAsync(user);
        var token = jwtTokenGenerator.GenerateToken(created);

        return new AuthResult(token, created.Id, created.Name, created.Email);
    }
}
