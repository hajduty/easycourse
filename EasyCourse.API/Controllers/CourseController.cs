using EasyCourse.Core.DTO;
using EasyCourse.Core.Interfaces.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EasyCourse.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CourseController(ICourseService courseService) : ApiControllerBase
{
    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<CourseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateCourse([FromBody] CourseDto newCourse)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized("User is not authenticated.");

        var createdCourse = await courseService.CreateCourse(newCourse, new Guid(userId));

        return HandleResult(createdCourse);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<CourseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCourse(Guid id)
    {
        var course = await courseService.GetCourseById(id);
        return HandleResult(course);
    }

    [HttpGet("user/{userId}")]
    [ProducesResponseType(typeof(ApiResponse<List<CourseDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCoursesByUser(Guid userId)
    {
        var courses = await courseService.GetCoursesByUserId(userId);
        return HandleResult(courses);
    }

    [HttpGet("search")]
    [ProducesResponseType(typeof(ApiResponse<List<CourseDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> SearchCourses([FromQuery] string query)
    {
        var courses = await courseService.SearchCoursesAsync(query);
        return HandleResult(courses);
    }

    [HttpPut]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<CourseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateCourse([FromBody] CourseDto updatedCourse)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized("User is not authenticated.");

        var result = await courseService.UpdateCourse(updatedCourse, new Guid(userId));
        return result ? HandleBoolResult(result, "Course updated successfully") : HandleBoolResult(result, "Failed to update course");
    }
}