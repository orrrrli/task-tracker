namespace Contracts.Auth.Responses;

public record AuthResponse(
    string Token,
    int UserId,
    string Name,
    string Email
);
