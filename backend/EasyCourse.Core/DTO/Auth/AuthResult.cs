namespace EasyCourse.Core.DTO.Auth;

public class AuthResult
{
    public Tokens Tokens { get; set; } = new();
    public UserResult User { get; set; } = new();
}