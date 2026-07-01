namespace Contracts.Auth.Requests;

public record RegisterRequest(
    string Name,
    string Email,
    string Password
);
