using API;
using API.Extensions;
using API.Helpers;
using Application;
using Carter;
using Infrastructure;
using Infrastructure.Common.Persistence;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.AddSerilog();

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddPresentation(builder.Configuration);

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
}

if (app.Environment.IsDevelopment())
    app.MapOpenApi();

app.UseForwardedHeaders();
app.UseHttpRequestLogging();
app.UseSecurityHeaders();
app.UseCors("DefaultPolicy");
app.UseHttpsRedirection();
app.UseRateLimiter();
app.UseExceptionHandler();
app.MapCarter();
app.MapHealthCheck();

LoggingHelper.Initialize(app.Services.GetRequiredService<ILoggerFactory>());

app.Run();
