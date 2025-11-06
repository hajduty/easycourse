namespace EasyCourse.Core.DTO;

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public string Errors { get; set; } = string.Empty;

    public static ApiResponse<T> Ok(T data, string message = "") => new()
    {
        Success = true,
        Data = data,
        Message = message
    };

    public static ApiResponse<T> Fail(string errors, string message = "") => new()
    {
        Success = false,
        Errors = errors,
        Message = message
    };
}