namespace EasyCourse.Core.DTO;

public class AuthResult
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public string Token { get; set; }
    public string UserId { get; set; }
    public IEnumerable<string> Errors { get; set; }
}
