using Application.UseCases.Task.Commands;
using Application.UseCases.Task.Validators;
using Domain.Enums;
using FluentAssertions;
using Xunit;

namespace Tests.Validators;

public class CreateTaskCommandValidatorTests
{
    private readonly CreateTaskCommandValidator _validator = new();

    [Fact]
    public void Empty_title_returns_required_error()
    {
        var command = new CreateTaskCommand("", null, TaskItemPriority.Medium, null, 1);

        var result = _validator.Validate(command);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().ContainSingle(e => e.ErrorMessage == "Title is required.");
    }

    [Fact]
    public void Title_exceeding_max_length_returns_error()
    {
        var command = new CreateTaskCommand(new string('a', 201), null, TaskItemPriority.Medium, null, 1);

        var result = _validator.Validate(command);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().ContainSingle(e => e.ErrorMessage == "Title must not exceed 200 characters.");
    }

    [Fact]
    public void Valid_title_passes()
    {
        var command = new CreateTaskCommand("My Task", null, TaskItemPriority.Medium, null, 1);

        var result = _validator.Validate(command);

        result.IsValid.Should().BeTrue();
    }
}
