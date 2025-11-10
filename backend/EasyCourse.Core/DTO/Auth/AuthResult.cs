namespace EasyCourse.Core.DTO.Auth;

public class AuthResult
{
    public string Token { get; set; } = string.Empty;
    public UserResult User { get; set; } = new UserResult();
}