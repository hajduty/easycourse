namespace EasyCourse.Core.DTO;

public class AuthResult
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public string Token { get; set; }
    public string UserId { get; set; }
    public string Errors { get; set; }
    public static AuthResult Fail(string message) => new() { Success = false, Errors = message };
    public static AuthResult Ok(string token, string userId) => new() { Success = true, Token = token, UserId = userId };
}
