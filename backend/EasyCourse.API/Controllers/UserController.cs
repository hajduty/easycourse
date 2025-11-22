using EasyCourse.Core.DTO;
using EasyCourse.Core.DTO.Course;
using EasyCourse.Core.Entities;
using EasyCourse.Core.Interfaces.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EasyCourse.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController(ICourseService courseService, IParticipantService participantService) : ApiControllerBase
{
    [HttpGet("participations")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<CourseParticipantDto[]>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUserParticipations()
    {
        var userId = GetUserId();
        var result = await participantService.GetUserParticipations(new Guid(userId));

        return HandleResult(result);
    }

    [HttpGet("courses")]
    [ProducesResponseType(typeof(ApiResponse<List<CourseResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCoursesByUser()
    {
        var userId = GetUserId();
        var courses = await courseService.GetCoursesByUserId(new Guid(userId), new Guid(userId));

        return HandleResult(courses);
    }
}