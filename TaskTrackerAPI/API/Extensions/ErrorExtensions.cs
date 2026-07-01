using API.Common;
using ErrorOr;

namespace API.Extensions;

public static class ErrorExtensions
{
    public static IResult ToProblemResult(this List<Error> errors)
    {
        if (errors.Count == 0)
            return Envelope(StatusCodes.Status500InternalServerError, "Unknown", "Unknown error");

        var first = errors.First();
        var statusCode = first.Type switch
        {
            ErrorType.Validation   => StatusCodes.Status400BadRequest,
            ErrorType.NotFound     => StatusCodes.Status404NotFound,
            ErrorType.Conflict     => StatusCodes.Status409Conflict,
            ErrorType.Unauthorized => StatusCodes.Status401Unauthorized,
            _                      => StatusCodes.Status500InternalServerError
        };

        var code = first.Type == ErrorType.Validation ? "Validation" : first.Code;
        var message = first.Type == ErrorType.Validation
            ? string.Join("; ", errors.Select(e => $"{e.Code}: {e.Description}"))
            : first.Description;

        return Envelope(statusCode, code, message);
    }

    private static IResult Envelope(int statusCode, string code, string message) =>
        TypedResults.Json(
            new ApiErrorResponse { Error = new ApiErrorDetail { Code = code, Message = message } },
            statusCode: statusCode);
}
