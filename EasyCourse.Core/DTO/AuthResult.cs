namespace EasyCourse.Core.DTO;

public class AuthResult
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string Errors { get; set; } = string.Empty;

    public static AuthResult Fail(string message) => new() { Success = false, Errors = message };
    public static AuthResult Ok(string token, string userId) => new() { Success = true, Token = token, UserId = userId };
}
