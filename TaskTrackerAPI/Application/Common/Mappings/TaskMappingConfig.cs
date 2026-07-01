using Application.Common.Models;
using Domain.Models;

namespace Application.Common.Mappings;

public class TaskMappingConfig : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<TaskItem, TaskResult>()
            .Map(dest => dest.CreatorName, src => src.Creator.Name)
            .Map(dest => dest.AssignedToName, src => src.AssignedTo != null ? src.AssignedTo.Name : null);
    }
}
