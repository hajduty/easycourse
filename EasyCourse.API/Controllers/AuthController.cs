using EasyCourse.Core.DTO;
using EasyCourse.Core.Interfaces;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.InteropServices;

namespace EasyCourse.API.Controllers;

[ApiController]
[Route("api/[controller]")]

public class AuthController(IAuthService authService) : ApiControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] AuthRequest request)
    {
        var result = await authService.LoginUser(request.Email,request.Password);

        return HandleResult(result);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] AuthRequest request)
    {
        var result = await authService.RegisterUser(request.Email, request.Password, request.Username);

        return HandleResult(result);
    }
}