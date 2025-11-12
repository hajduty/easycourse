using System.Text.Json.Serialization;

namespace EasyCourse.Core.DTO.Course;

public class CourseQuery
{
    public string? Query { get; set; } = null;  // optional
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 8;
    public string? SortBy { get; set; } = "participantcount";
    public bool Descending { get; set; } = true;
    public int? MinParticipants { get; set; } = null;
}
