using EasyCourse.Core.DTO;
using System.ComponentModel.DataAnnotations;

namespace EasyCourse.API.Middleware;

public class ErrorHandlingMiddleware(RequestDelegate next)
{
    public async Task Invoke(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (ValidationException ve)
        {
            context.Response.StatusCode = 400;
            await context.Response.WriteAsJsonAsync(ApiResponse<object>.Fail(ve.Message));
        }
        catch (Exception ex)
        {
            context.Response.StatusCode = 500;
            await context.Response.WriteAsJsonAsync(ApiResponse<object>.Fail(ex.Message));
        }
    }
}
