using Application.Common.Interfaces.Persistence;
using Application.Common.Models;
using Application.UseCases.Task.Commands;
using Application.UseCases.Task.Handlers;
using Domain.Enums;
using Domain.Models;
using FluentAssertions;
using MapsterMapper;
using NSubstitute;
using Xunit;

namespace Tests.Handlers;

public class UpdateTaskCommandHandlerTests
{
    private readonly ITaskRepository _repository = Substitute.For<ITaskRepository>();
    private readonly IMapper _mapper = Substitute.For<IMapper>();
    private readonly UpdateTaskCommandHandler _handler;

    public UpdateTaskCommandHandlerTests()
    {
        _handler = new UpdateTaskCommandHandler(_repository, _mapper);
    }

    [Fact]
    public async Task Returns_not_found_when_task_does_not_exist()
    {
        _repository.GetByIdAsync(99).Returns((TaskItem?)null);

        var result = await _handler.Handle(
            new UpdateTaskCommand(99, "New title", null, null, null, null), CancellationToken.None);

        result.IsError.Should().BeTrue();
        result.FirstError.Code.Should().Be("Task.NotFound");
    }

    [Fact]
    public async Task Returns_error_when_task_is_done()
    {
        var task = new TaskItem { Id = 1, Status = TaskItemStatus.Done };
        _repository.GetByIdAsync(1).Returns(task);

        var result = await _handler.Handle(
            new UpdateTaskCommand(1, "New title", null, null, null, null), CancellationToken.None);

        result.IsError.Should().BeTrue();
        result.FirstError.Code.Should().Be("Task.AlreadyCompleted");
    }

    [Fact]
    public async Task Returns_error_when_task_is_cancelled()
    {
        var task = new TaskItem { Id = 1, Status = TaskItemStatus.Cancelled };
        _repository.GetByIdAsync(1).Returns(task);

        var result = await _handler.Handle(
            new UpdateTaskCommand(1, "New title", null, null, null, null), CancellationToken.None);

        result.IsError.Should().BeTrue();
        result.FirstError.Code.Should().Be("Task.AlreadyCancelled");
    }

    [Fact]
    public async Task Updates_fields_and_returns_result()
    {
        var task = new TaskItem { Id = 1, Title = "Old", Status = TaskItemStatus.Todo, Creator = new User { Name = "Alice" } };
        var expected = new TaskResult(1, "New title", null, TaskItemStatus.Todo,
            TaskItemPriority.Medium, 1, "Alice", null, null, DateTime.UtcNow, DateTime.UtcNow);

        _repository.GetByIdAsync(1).Returns(task);
        _repository.UpdateAsync(task).Returns(task);
        _mapper.Map<TaskResult>(task).Returns(expected);

        var result = await _handler.Handle(
            new UpdateTaskCommand(1, "New title", null, null, null, null), CancellationToken.None);

        result.IsError.Should().BeFalse();
        result.Value.Title.Should().Be("New title");
        await _repository.Received(1).UpdateAsync(task);
    }
}
