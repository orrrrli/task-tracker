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

public class ListTasksQueryHandlerTests
{
    private readonly ITaskRepository _repository = Substitute.For<ITaskRepository>();
    private readonly IMapper _mapper = Substitute.For<IMapper>();
    private readonly ListTasksQueryHandler _handler;

    public ListTasksQueryHandlerTests()
    {
        _handler = new ListTasksQueryHandler(_repository, _mapper);
    }

    [Fact]
    public async Task Returns_all_tasks_when_no_filter()
    {
        var task1 = new TaskItem { Id = 1, Title = "A", Status = TaskItemStatus.Todo, CreatedAt = DateTime.UtcNow };
        var task2 = new TaskItem { Id = 2, Title = "B", Status = TaskItemStatus.InProgress, CreatedAt = DateTime.UtcNow };
        var result1 = new TaskResult(1, "A", null, TaskItemStatus.Todo, TaskItemPriority.Medium, 1, "", null, null, DateTime.UtcNow, DateTime.UtcNow);
        var result2 = new TaskResult(2, "B", null, TaskItemStatus.InProgress, TaskItemPriority.Medium, 1, "", null, null, DateTime.UtcNow, DateTime.UtcNow);

        _repository.GetAllAsync().Returns([task1, task2]);
        _mapper.Map<TaskResult>(task1).Returns(result1);
        _mapper.Map<TaskResult>(task2).Returns(result2);

        var result = await _handler.Handle(
            new ListTasksQuery(null, null, null, null), CancellationToken.None);

        result.IsError.Should().BeFalse();
        result.Value.Should().HaveCount(2);
    }

    [Fact]
    public async Task Filters_tasks_by_status()
    {
        var todo = new TaskItem { Id = 1, Title = "A", Status = TaskItemStatus.Todo, CreatedAt = DateTime.UtcNow };
        var done = new TaskItem { Id = 2, Title = "B", Status = TaskItemStatus.Done, CreatedAt = DateTime.UtcNow };
        var todoResult = new TaskResult(1, "A", null, TaskItemStatus.Todo, TaskItemPriority.Medium, 1, "", null, null, DateTime.UtcNow, DateTime.UtcNow);

        _repository.GetAllAsync().Returns([todo, done]);
        _mapper.Map<TaskResult>(todo).Returns(todoResult);

        var result = await _handler.Handle(
            new ListTasksQuery(TaskItemStatus.Todo, null, null, null), CancellationToken.None);

        result.IsError.Should().BeFalse();
        result.Value.Should().HaveCount(1);
        result.Value[0].Status.Should().Be(TaskItemStatus.Todo);
    }
}
