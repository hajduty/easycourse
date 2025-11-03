using EasyCourse.Core.DTO;
using EasyCourse.Core.Interfaces;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace EasyCourse.API.Controllers;

[ApiController]
[Route("api/[controller]")]

public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] AuthRequest request)
    {
        var result = await _authService.LoginUser(request.Email,request.Password);

        if (!result.Success)
            return BadRequest(result.Errors);

        return Ok(result);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] AuthRequest request)
    {
        var result = await _authService.RegisterUser(request.Email, request.Password, request.Username);

        if (!result.Success)
            return BadRequest(result.Errors);

        return Ok(result);
    }
}
