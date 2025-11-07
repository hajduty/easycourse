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
    public async Task<IActionResult> CreateCourse([FromBody] CourseDto newCourse)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized("User is not authenticated.");

        var createdCourse = await courseService.CreateCourse(newCourse, userId);

        return HandleResult(createdCourse);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCourse(Guid id)
    {
        var course = await courseService.GetCourseById(id);
        return HandleResult(course);
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetCoursesByUser(string userId)
    {
        var courses = await courseService.GetCoursesByUserId(userId);
        return HandleResult(courses);
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchCourses([FromQuery] string query)
    {
        var courses = await courseService.SearchCoursesAsync(query);
        return HandleResult(courses);
    }

    [HttpPut]
    [Authorize]
    public async Task<IActionResult> UpdateCourse([FromBody] CourseDto updatedCourse)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized("User is not authenticated.");

        var result = await courseService.UpdateCourse(updatedCourse, userId);
        return result ? Ok("Course updated successfully.") : BadRequest("Failed to update course.");
    }
}