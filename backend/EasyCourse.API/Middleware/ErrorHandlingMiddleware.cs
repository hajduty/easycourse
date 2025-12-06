using EasyCourse.Core.DTO;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Security.Authentication;

namespace EasyCourse.API.Middleware;

public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;

    public ErrorHandlingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleException(context, ex);
        }
    }

    private static async Task HandleException(HttpContext context, Exception ex)
    {
        var (status, message) = ex switch
        {
            ValidationException => (400, ex.Message),
            AuthenticationException => (401, "Authentication failed."),
            UnauthorizedAccessException => (403, "Access denied."),
            KeyNotFoundException => (404, ex.Message),
            DbUpdateConcurrencyException => (409, "A concurrency conflict occurred."),
            DbUpdateException => (400, "A database error occurred."),
            InvalidOperationException => (400, ex.Message),
            _ => (500, "An unexpected server error occurred.")
        };

        context.Response.StatusCode = status;

        await context.Response.WriteAsJsonAsync(ApiResponse<object>.Fail(message));
    }
}
