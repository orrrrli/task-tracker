namespace Application.UseCases.Auth.Common;

public record AuthResult(
    string Token,
    int UserId,
    string Name,
    string Email
);
