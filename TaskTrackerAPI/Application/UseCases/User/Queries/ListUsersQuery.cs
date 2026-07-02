using Application.Common.Models;

namespace Application.UseCases.User.Queries;

public record ListUsersQuery : IRequest<ErrorOr<List<UserResult>>>;
