using API;
using API.Extensions;
using API.Helpers;
using Application;
using Carter;
using Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddPresentation(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
    app.MapOpenApi();

app.UseSecurityHeaders();
app.UseCors("DefaultPolicy");
app.UseHttpsRedirection();
app.UseRateLimiter();
app.UseExceptionHandler();
app.MapCarter();
app.MapHealthCheck();

LoggingHelper.Initialize(app.Services.GetRequiredService<ILoggerFactory>());

app.Run();
