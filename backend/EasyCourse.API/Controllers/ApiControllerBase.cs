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
        if (data is bool boolResult)
        {
            return boolResult ?
                Ok(ApiResponse<object>.Ok(null, successMessage)) :
                BadRequest(ApiResponse<object>.Fail(failureMessage));
        }

        if (data == null)
            return BadRequest(ApiResponse<T>.Fail(failureMessage));

        return Ok(ApiResponse<T>.Ok(data, successMessage));
    }

    protected IActionResult HandleBoolResult(bool result, string successMessage = "", string failureMessage = "Operation failed")
    {
        return result ?
            Ok(ApiResponse<object>.Ok(null, successMessage)) :
            BadRequest(ApiResponse<object>.Fail(failureMessage));
    }

    protected string GetUserId()
    {
        var id =
            User?.FindFirst("sub")?.Value ??
            User?.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
            User?.FindFirst("UserId")?.Value;

        if (string.IsNullOrWhiteSpace(id))
            throw new InvalidOperationException("User ID claim is missing in the token.");

        return id;
    }
}