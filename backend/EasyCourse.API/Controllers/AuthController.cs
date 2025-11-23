using EasyCourse.Core.DTO;
using EasyCourse.Core.DTO.Auth;
using EasyCourse.Core.Interfaces.Service;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace EasyCourse.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ApiControllerBase
{
    [HttpPost("login")]
    [ProducesResponseType(typeof(ApiResponse<AuthResult>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Login([FromBody] AuthRequest request)
    {
        var result = await authService.LoginUser(request.Email,request.Password);

        return HandleResult(result);
    }

    [HttpPost("register")]
    [ProducesResponseType(typeof(ApiResponse<AuthResult>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Register([FromBody] AuthRequest request)
    {
        var result = await authService.RegisterUser(request.Email, request.Password, request.Username);

        return HandleResult(result);
    }

    [HttpPost("refresh")]
    [ProducesResponseType(typeof(ApiResponse<AuthResult>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Refresh([FromBody] Core.DTO.Auth.RefreshRequest request)
    {
        var result = await authService.RefreshToken(request.RefreshToken, request.RefreshTokenId);

        return HandleResult(result);
    }
}