using Application.UseCases.Task.Commands;
using Application.UseCases.Task.Validators;
using FluentAssertions;
using Xunit;

namespace Tests.Validators;

public class UpdateTaskCommandValidatorTests
{
    private readonly UpdateTaskCommandValidator _validator = new();

    [Fact]
    public void Title_within_max_length_is_valid()
    {
        var command = new UpdateTaskCommand(1, new string('a', 200), null, null, null, null);

        var result = _validator.Validate(command);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Title_exceeding_max_length_returns_error()
    {
        var command = new UpdateTaskCommand(1, new string('a', 201), null, null, null, null);

        var result = _validator.Validate(command);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().ContainSingle(e => e.ErrorMessage == "Title must not exceed 200 characters.");
    }

    [Fact]
    public void Null_title_passes_validation()
    {
        var command = new UpdateTaskCommand(1, null, null, null, null, null);

        var result = _validator.Validate(command);

        result.IsValid.Should().BeTrue();
    }
}
