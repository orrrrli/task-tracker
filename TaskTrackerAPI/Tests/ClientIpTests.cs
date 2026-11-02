using System.Net;
using API;
using API.Helpers;
using FluentAssertions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Xunit;

namespace Tests;

public class ClientIpTests
{
    [Theory]
    [InlineData("203.0.113.7", "203.0.113.7")]
    [InlineData("::ffff:203.0.113.7", "203.0.113.7")]
    [InlineData("2001:db8:abcd:12:1:2:3:4", "2001:db8:abcd:12::/64")]
    [InlineData("2001:db8:abcd:12:ffff::1", "2001:db8:abcd:12::/64")]
    public void RateLimitKey_GroupsIpv6ByPrefix(string ip, string expected) =>
        ClientIp.RateLimitKey(IPAddress.Parse(ip)).Should().Be(expected);

    [Fact]
    public void RateLimitKey_SeparatesDifferentPrefixes() =>
        ClientIp.RateLimitKey(IPAddress.Parse("2001:db8:abcd:12::1"))
            .Should().NotBe(ClientIp.RateLimitKey(IPAddress.Parse("2001:db8:abcd:13::1")));

    // Uses the API's own appsettings.json, so a broken KnownNetworks list fails here.
    [Theory]
    // Cloudflare → nginx → container: the client prepended a fake entry, it is ignored.
    [InlineData("172.18.0.1", "6.6.6.6, 198.51.100.9, 104.16.0.1", "198.51.100.9")]
    // Cloudflare over IPv6.
    [InlineData("172.18.0.1", "2001:db8::5, 2606:4700::1", "2001:db8::5")]
    // Direct request to the origin from an untrusted peer: its header is ignored.
    [InlineData("8.8.8.8", "6.6.6.6", "8.8.8.8")]
    public async Task ForwardedHeaders_ResolveRightMostUntrustedHop(string peer, string xff, string expected)
    {
        IConfiguration configuration = new ConfigurationBuilder()
            .AddJsonFile(Path.Combine(AppContext.BaseDirectory, "appsettings.json"))
            .Build();
        IOptions<ForwardedHeadersOptions> options = new ServiceCollection()
            .AddForwardedHeadersConfig(configuration)
            .BuildServiceProvider()
            .GetRequiredService<IOptions<ForwardedHeadersOptions>>();

        var context = new DefaultHttpContext();
        context.Connection.RemoteIpAddress = IPAddress.Parse(peer);
        context.Request.Headers["X-Forwarded-For"] = xff;
        var middleware = new ForwardedHeadersMiddleware(_ => Task.CompletedTask, NullLoggerFactory.Instance, options);

        await middleware.Invoke(context);

        context.Connection.RemoteIpAddress!.ToString().Should().Be(expected);
    }
}
