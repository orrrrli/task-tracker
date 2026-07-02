using Application.Common.Interfaces.Persistence;
using Application.Common.Models;
using Application.UseCases.User.Queries;

namespace Application.UseCases.User.Handlers;

public class ListUsersQueryHandler(IUserRepository userRepository)
    : IRequestHandler<ListUsersQuery, ErrorOr<List<UserResult>>>
{
    public async Task<ErrorOr<List<UserResult>>> Handle(ListUsersQuery query, CancellationToken cancellationToken)
    {
        var users = await userRepository.GetAllAsync();
        return users.Select(u => new UserResult(u.Id, u.Name)).ToList();
    }
}
