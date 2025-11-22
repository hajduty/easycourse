using EasyCourse.Core.DTO;
using EasyCourse.Core.DTO.Course;
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
    [ProducesResponseType(typeof(ApiResponse<CourseResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateCourse([FromBody] CourseRequest newCourse)
    {
        var userId = GetUserId(); 
        if (userId == null)
            return Unauthorized("User is not authenticated.");

        var createdCourse = await courseService.CreateCourse(newCourse, new Guid(userId));

        return HandleResult(createdCourse);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<CourseResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCourse(Guid id)
    {
        var course = await courseService.GetCourseById(id);
        return HandleResult(course);
    }

    [HttpGet("user/{userId}")]
    [ProducesResponseType(typeof(ApiResponse<List<CourseResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCoursesByUser(Guid userId)
    {
        var requestString = GetUserId();

        Guid? requestId = null;

        if (Guid.TryParse(requestString, out var parsed))
        {
            requestId = parsed;
        }

        var courses = await courseService.GetCoursesByUserId(userId, requestId);
        return HandleResult(courses);
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<CourseResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCourses([FromQuery(Name = "")] CourseQuery query)
    {
        var courses = await courseService.GetCoursesAsync(query);
        return HandleResult(courses);
    }

    [HttpPut("{id}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<CourseRequest>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateCourse([FromBody] CourseRequest updatedCourse, Guid id)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized("User is not authenticated.");

        var result = await courseService.UpdateCourse(updatedCourse, new Guid(userId), id);
        return HandleResult(result);
    }

    [HttpDelete("{id}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteCourse(Guid id)
    {
        var userId = GetUserId();

        if (userId == null)
            return Unauthorized("User is not authenticated.");

        var result = await courseService.DeleteCourseById(id, new Guid(userId));
        return HandleBoolResult(result);
    }
}