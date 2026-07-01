using Contracts.Tasks.Responses;
using Domain.Models;

namespace API.Common.Mappings;

public class TaskMappingConfig : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<TaskItem, TaskResponse>()
            .Map(dest => dest.CreatorName, src => src.Creator.Name)
            .Map(dest => dest.AssignedToName, src => src.AssignedTo != null ? src.AssignedTo.Name : null);
    }
}
