using FluentAssertions;
using Xunit;

namespace Tests;

public class SmokeTests
{
    [Fact]
    public void Smoke_test_passes()
    {
        true.Should().BeTrue();
    }
}
