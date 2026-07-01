using ErrorOr;

namespace API.Extensions;

public static class ErrorExtensions
{
    public static IResult ToProblemResult(this List<Error> errors)
    {
        if (errors.All(e => e.Type == ErrorType.Validation))
        {
            var validationErrors = errors.ToDictionary(
                e => e.Code,
                e => new[] { e.Description });
            return TypedResults.ValidationProblem(validationErrors);
        }

        var first = errors.First();
        var statusCode = first.Type switch
        {
            ErrorType.NotFound     => StatusCodes.Status404NotFound,
            ErrorType.Conflict     => StatusCodes.Status409Conflict,
            ErrorType.Unauthorized => StatusCodes.Status401Unauthorized,
            _                      => StatusCodes.Status500InternalServerError
        };

        return TypedResults.Problem(detail: first.Description, statusCode: statusCode, title: first.Code);
    }
}
