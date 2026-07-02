using Application.Common.Interfaces.Persistence;
using Application.UseCases.Task.Commands;
using Application.UseCases.Task.Handlers;
using Domain.Enums;
using Domain.Models;
using FluentAssertions;
using NSubstitute;
using Xunit;

namespace Tests.Handlers;

public class DeleteTaskCommandHandlerTests
{
    private readonly ITaskRepository _repository = Substitute.For<ITaskRepository>();
    private readonly DeleteTaskCommandHandler _handler;

    public DeleteTaskCommandHandlerTests()
    {
        _handler = new DeleteTaskCommandHandler(_repository);
    }

    [Fact]
    public async Task Returns_not_found_when_task_does_not_exist()
    {
        _repository.GetByIdAsync(99).Returns((TaskItem?)null);

        var result = await _handler.Handle(new DeleteTaskCommand(99), CancellationToken.None);

        result.IsError.Should().BeTrue();
        result.FirstError.Code.Should().Be("Task.NotFound");
    }

    [Fact]
    public async Task Returns_error_when_task_is_done()
    {
        var task = new TaskItem { Id = 1, Status = TaskItemStatus.Done };
        _repository.GetByIdAsync(1).Returns(task);

        var result = await _handler.Handle(new DeleteTaskCommand(1), CancellationToken.None);

        result.IsError.Should().BeTrue();
        result.FirstError.Code.Should().Be("Task.AlreadyCompleted");
    }

    [Fact]
    public async Task Returns_error_when_task_is_cancelled()
    {
        var task = new TaskItem { Id = 1, Status = TaskItemStatus.Cancelled };
        _repository.GetByIdAsync(1).Returns(task);

        var result = await _handler.Handle(new DeleteTaskCommand(1), CancellationToken.None);

        result.IsError.Should().BeTrue();
        result.FirstError.Code.Should().Be("Task.AlreadyCancelled");
    }

    [Fact]
    public async Task Deletes_task_and_returns_deleted()
    {
        var task = new TaskItem { Id = 1, Status = TaskItemStatus.Todo };
        _repository.GetByIdAsync(1).Returns(task);

        var result = await _handler.Handle(new DeleteTaskCommand(1), CancellationToken.None);

        result.IsError.Should().BeFalse();
        await _repository.Received(1).DeleteAsync(task);
    }
}
