using API.Helpers;
using Application;
using Carter;
using Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddCarter();
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
    app.MapOpenApi();

app.UseHttpsRedirection();
app.MapCarter();

LoggingHelper.Initialize(app.Services.GetRequiredService<ILoggerFactory>());

app.Run();
