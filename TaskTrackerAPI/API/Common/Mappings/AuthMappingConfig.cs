using Application.UseCases.Auth.Common;
using Contracts.Auth.Responses;

namespace API.Common.Mappings;

public class AuthMappingConfig : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        // Boundary mapping: Application result -> public API response (identical shape).
        config.NewConfig<AuthResult, AuthResponse>();
    }
}
