using Application.Common.Models;
using Application.UseCases.Task.Common;
using Contracts.Tasks.Responses;

namespace API.Common.Mappings;

public class TaskMappingConfig : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        // Boundary mapping: Application result -> public API response (identical shape).
        config.NewConfig<TaskResult, TaskResponse>();
    }
}
