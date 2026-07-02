using ErrorOr;

namespace Application.Common.Errors;

public static class AuthErrors
{
    public static readonly Error InvalidCredentials = Error.Unauthorized(
        "Auth.InvalidCredentials", "Invalid email or password.");

    public static readonly Error EmailAlreadyExists = Error.Conflict(
        "Auth.EmailAlreadyExists", "A user with this email already exists.");
}
