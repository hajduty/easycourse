using System.Text.Json.Serialization;

namespace EasyCourse.Core.DTO;

public class ApiResponse
{
    public bool Success { get; set; }
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string Message { get; set; } = string.Empty;
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string Errors { get; set; } = string.Empty;

    public static Type Ok<T>(T data) => typeof(ApiResponse<T>);
    public static Type Fail<T>() => typeof(ApiResponse<T>);
}

public class ApiResponse<T> : ApiResponse
{
    public T? Data { get; set; }

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