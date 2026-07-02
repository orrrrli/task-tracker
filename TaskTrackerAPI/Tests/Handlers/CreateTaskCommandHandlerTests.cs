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

public class CreateTaskCommandHandlerTests
{
    private readonly ITaskRepository _repository = Substitute.For<ITaskRepository>();
    private readonly IMapper _mapper = Substitute.For<IMapper>();
    private readonly CreateTaskCommandHandler _handler;

    public CreateTaskCommandHandlerTests()
    {
        _handler = new CreateTaskCommandHandler(_repository, _mapper);
    }

    [Fact]
    public async Task Returns_task_result_on_success()
    {
        var command = new CreateTaskCommand("My Task", null, TaskItemPriority.Medium, null, 1);
        var created = new TaskItem { Id = 1, Title = "My Task" };
        var full = new TaskItem
        {
            Id = 1,
            Title = "My Task",
            Creator = new User { Id = 1, Name = "Alice" }
        };
        var expected = new TaskResult(1, "My Task", null, TaskItemStatus.Todo,
            TaskItemPriority.Medium, 1, "Alice", null, null, DateTime.UtcNow, DateTime.UtcNow);

        _repository.AddAsync(Arg.Any<TaskItem>()).Returns(created);
        _repository.GetByIdAsync(1).Returns(full);
        _mapper.Map<TaskResult>(full).Returns(expected);

        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsError.Should().BeFalse();
        result.Value.Id.Should().Be(1);
        result.Value.Title.Should().Be("My Task");
    }
}
