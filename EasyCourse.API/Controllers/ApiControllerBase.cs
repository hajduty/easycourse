using EasyCourse.Core.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EasyCourse.API.Controllers;

[ApiController]
public class ApiControllerBase : ControllerBase
{
    protected IActionResult HandleResult<T>(T? data, string successMessage = "", string failureMessage = "Operation failed")
    where T : class
    {
        if (data == null)
            return BadRequest(ApiResponse<T>.Fail(failureMessage));

        return Ok(ApiResponse<T>.Ok(data, successMessage));
    }

    protected string? GetUserId()
    {
        return User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? User?.FindFirst("sub")?.Value
            ?? User?.FindFirst("UserId")?.Value;
    }
}