using Application.Common.Interfaces.Persistence;
using Application.Common.Models;
using Application.UseCases.Task.Common;
using Application.UseCases.Task.Handlers;
using Application.UseCases.Task.Queries;
using Domain.Enums;
using Domain.Models;
using FluentAssertions;
using MapsterMapper;
using NSubstitute;
using Xunit;

namespace Tests.Handlers;

public class GetTaskByIdQueryHandlerTests
{
    private readonly ITaskRepository _repository = Substitute.For<ITaskRepository>();
    private readonly IMapper _mapper = Substitute.For<IMapper>();
    private readonly GetTaskByIdQueryHandler _handler;

    public GetTaskByIdQueryHandlerTests()
    {
        _handler = new GetTaskByIdQueryHandler(_repository, _mapper);
    }

    [Fact]
    public async Task Returns_not_found_when_task_does_not_exist()
    {
        _repository.GetByIdAsync(99).Returns((TaskItem?)null);

        var result = await _handler.Handle(new GetTaskByIdQuery(99), CancellationToken.None);

        result.IsError.Should().BeTrue();
        result.FirstError.Code.Should().Be("Task.NotFound");
    }

    [Fact]
    public async Task Returns_task_result_when_found()
    {
        var task = new TaskItem { Id = 1, Title = "Test", Creator = new User { Name = "Alice" } };
        var expected = new TaskResult(1, "Test", null, TaskItemStatus.Todo,
            TaskItemPriority.Medium, 1, "Alice", null, null, DateTime.UtcNow, DateTime.UtcNow);

        _repository.GetByIdAsync(1).Returns(task);
        _mapper.Map<TaskResult>(task).Returns(expected);

        var result = await _handler.Handle(new GetTaskByIdQuery(1), CancellationToken.None);

        result.IsError.Should().BeFalse();
        result.Value.Id.Should().Be(1);
        result.Value.Title.Should().Be("Test");
    }
}
